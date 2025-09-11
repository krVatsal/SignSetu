import { NextResponse } from 'next/server';
import dbConnect, { getDatabase } from '../../../lib/mongodb';
import { sendSessionReminderEmail } from '../../../lib/email';

export async function POST(request: Request) {
  try {
    const { sessionId, userEmail } = await request.json();

    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { error: 'Session ID and user email are required' },
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

    // Find the session
    const session = await db.collection('sessions').findOne({ _id: sessionId });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Format time for display
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

    // Send the reminder email
    const emailSent = await sendSessionReminderEmail(userEmail, {
      title: session.title,
      date: formatDate(session.date),
      startTime: formatTime(session.startTime),
      endTime: formatTime(session.endTime),
      description: session.description
    });

    if (emailSent) {
      // Mark reminder as sent
      await db.collection('sessions').updateOne(
        { _id: sessionId },
        { $set: { reminderSent: true, manualReminderSentAt: new Date() } }
      );

      return NextResponse.json({
        success: true,
        message: 'Test reminder sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending test reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send test reminder' },
      { status: 500 }
    );
  }
}
