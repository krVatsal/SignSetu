import { NextResponse } from 'next/server';
import dbConnect, { getDatabase } from '../../../lib/mongodb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const db = await getDatabase();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get current time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Find user
    const user = await db.collection('users').findOne({ userId });
    
    // Find sessions for today
    const sessions = await db.collection('sessions').find({
      userId,
      date: currentDate
    }).toArray();

    const sessionAnalysis = sessions.map(session => {
      const [hours, minutes] = session.startTime.split(':').map(Number);
      const sessionStart = new Date();
      sessionStart.setHours(hours, minutes, 0, 0);
      
      const reminderMinutes = user?.reminderMinutes || 10;
      const reminderTime = new Date(sessionStart.getTime() - (reminderMinutes * 60 * 1000));
      
      const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
      const oneMinute = 60 * 1000;
      
      return {
        sessionId: session._id,
        title: session.title,
        startTime: session.startTime,
        sessionStartFormatted: sessionStart.toLocaleTimeString(),
        reminderTimeFormatted: reminderTime.toLocaleTimeString(),
        currentTimeFormatted: now.toLocaleTimeString(),
        timeDifferenceSeconds: Math.round(timeDiff / 1000),
        shouldSendReminder: timeDiff <= oneMinute,
        reminderSent: !!session.reminderSent
      };
    });

    return NextResponse.json({
      success: true,
      currentTime: now.toISOString(),
      currentDate,
      user: user ? {
        email: user.email,
        emailNotifications: user.emailNotifications,
        reminderMinutes: user.reminderMinutes
      } : null,
      sessions: sessionAnalysis
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to get debug info' },
      { status: 500 }
    );
  }
}
