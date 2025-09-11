import cron from 'node-cron';
import { ObjectId } from 'mongodb';
import dbConnect, { getDatabase } from './mongodb';
import { sendSessionReminderEmail } from './email';

interface ScheduledSession {
  _id: ObjectId;
  userId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  reminderSent?: boolean;
}

interface User {
  userId: string;
  email: string;
  emailNotifications: boolean;
  reminderMinutes: number;
}

let cronJobStarted = false;

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const checkAndSendReminders = async () => {
  try {
    console.log('🔍 Checking for sessions that need reminders...');
    
    await dbConnect();
    const db = await getDatabase();
    
    if (!db) {
      console.error('❌ Database connection failed');
      return;
    }

    // Get current time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Find sessions for today that haven't had reminders sent
    const sessions = await db.collection('sessions').find({
      date: currentDate,
      reminderSent: { $ne: true }
    }).toArray() as unknown as ScheduledSession[];

    console.log(`📅 Found ${sessions.length} sessions for today that might need reminders`);

    for (const session of sessions) {
      try {
        console.log(`🔎 Processing session: ${session.title} at ${session.startTime}`);
        
        // Parse session start time
        const [hours, minutes] = session.startTime.split(':').map(Number);
        const sessionStart = new Date();
        sessionStart.setHours(hours, minutes, 0, 0);

        // Calculate reminder time (10 minutes before by default)
        const user = await db.collection('users').findOne({ userId: session.userId }) as User | null;
        
        if (!user) {
          console.log(`❌ User not found for session: ${session.title}`);
          continue;
        }
        
        console.log(`👤 User found: ${user.email}, emailNotifications: ${user.emailNotifications}`);
        
        const reminderMinutes = user?.reminderMinutes || 10;
        const reminderTime = new Date(sessionStart.getTime() - (reminderMinutes * 60 * 1000));

        console.log(`⏰ Session start: ${sessionStart.toLocaleTimeString()}`);
        console.log(`🔔 Reminder time: ${reminderTime.toLocaleTimeString()}`);
        console.log(`🕐 Current time: ${now.toLocaleTimeString()}`);

        // Check if it's time to send reminder (within 1 minute window)
        const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
        const oneMinute = 60 * 1000;
        
        console.log(`⏱️ Time difference: ${Math.round(timeDiff / 1000)} seconds (should be <= 60)`);

        if (timeDiff <= oneMinute && user && user.emailNotifications && !session.reminderSent) {
          console.log(`📧 Attempting to send reminder for session: ${session.title} to ${user.email}`);
          
          // Use atomic operation to mark reminder as being sent (prevents race conditions)
          const updateResult = await db.collection('sessions').updateOne(
            { 
              _id: session._id, 
              reminderSent: { $ne: true } // Only update if reminder hasn't been sent
            },
            { 
              $set: { 
                reminderSent: true,
                reminderSentAt: new Date(),
                reminderSentTo: user.email
              } 
            }
          );
          
          // Only send email if we successfully marked it as sent (no race condition)
          if (updateResult.modifiedCount > 0) {
            console.log(`📧 Sending reminder for session: ${session.title} to ${user.email}`);
            
            const emailSent = await sendSessionReminderEmail(user.email, {
              title: session.title,
              date: formatDate(session.date),
              startTime: formatTime(session.startTime),
              endTime: formatTime(session.endTime),
              description: session.description
            });

            if (emailSent) {
              console.log(`✅ Reminder sent successfully for session: ${session.title}`);
            } else {
              console.log(`❌ Failed to send reminder email for session: ${session.title}`);
              // Revert the reminderSent flag if email failed
              await db.collection('sessions').updateOne(
                { _id: session._id },
                { 
                  $unset: { 
                    reminderSent: "",
                    reminderSentAt: "",
                    reminderSentTo: ""
                  } 
                }
              );
            }
          } else {
            console.log(`⚠️ Reminder already sent for session: ${session.title} (race condition prevented)`);
          }
        } else {
          if (timeDiff > oneMinute) {
            console.log(`⏰ Not time yet for session: ${session.title} (${Math.round(timeDiff / 1000)}s difference)`);
          }
          if (!user) {
            console.log(`👤 No user found for session: ${session.title}`);
          }
          if (user && !user.emailNotifications) {
            console.log(`🔕 Email notifications disabled for user: ${user.email}`);
          }
          if (session.reminderSent) {
            console.log(`✅ Reminder already sent for session: ${session.title}`);
          }
        }
      } catch (sessionError) {
        console.error(`❌ Error processing session ${session._id}:`, sessionError);
      }
    }
  } catch (error) {
    console.error('❌ Error in checkAndSendReminders:', error);
  }
};

export const startCronJob = () => {
  if (cronJobStarted) {
    console.log('⚠️ CRON job already running');
    return;
  }

  try {
    // Run every 30 seconds to check for reminders (reduced frequency)
    cron.schedule('*/30 * * * * *', async () => {
      await checkAndSendReminders();
    }, {
      timezone: 'America/New_York' // You can change this to your timezone
    });

    // Start the cron job
    cronJobStarted = true;
    
    console.log('🚀 CRON job started - checking for session reminders every 30 seconds');
    
    // Also run an initial check
    setTimeout(checkAndSendReminders, 5000); // Wait 5 seconds for app to fully initialize
    
  } catch (error) {
    console.error('❌ Failed to start CRON job:', error);
  }
};

export const stopCronJob = () => {
  // Note: node-cron doesn't provide a direct way to stop all tasks
  // This is more for completeness and logging
  cronJobStarted = false;
  console.log('🛑 CRON job stopped');
};

export const getCronJobStatus = () => {
  return {
    isRunning: cronJobStarted,
    nextCheck: 'Every 30 seconds',
    description: 'Checks for sessions that need email reminders 10 minutes before start time'
  };
};
