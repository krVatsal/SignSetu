import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    await dbConnect();
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    if (sessionId) {
      // Reset specific session
      const result = await db.collection('sessions').updateOne(
        { _id: sessionId },
        { 
          $unset: { 
            reminderSent: "",
            reminderSentAt: "",
            reminderSentTo: ""
          } 
        }
      );
      
      return NextResponse.json({
        success: true,
        message: `Reset reminder flag for session ${sessionId}`,
        modifiedCount: result.modifiedCount
      });
    } else {
      // Reset all sessions (for testing)
      const result = await db.collection('sessions').updateMany(
        {},
        { 
          $unset: { 
            reminderSent: "",
            reminderSentAt: "",
            reminderSentTo: ""
          } 
        }
      );
      
      return NextResponse.json({
        success: true,
        message: `Reset reminder flags for all sessions`,
        modifiedCount: result.modifiedCount
      });
    }
  } catch (error) {
    console.error('Error resetting reminder flags:', error);
    return NextResponse.json(
      { error: 'Failed to reset reminder flags' },
      { status: 500 }
    );
  }
}
