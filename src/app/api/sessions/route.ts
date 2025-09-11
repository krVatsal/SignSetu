import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// GET /api/sessions - Get all sessions for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    // Get sessions sorted by date and time (newest/upcoming first)
    const sessionsData = await db.collection('sessions').find({ userId }).sort({ date: -1, startTime: -1 }).toArray();
    
    // Calculate dynamic status for each session
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentTime = now.getHours() * 60 + now.getMinutes(); // current time in minutes since midnight
    
    const sessions = sessionsData.map((session: any) => {
      let status = 'upcoming';
      
      const sessionDate = session.date;
      const [sessionHours, sessionMinutes] = session.endTime.split(':').map(Number);
      const sessionEndTimeInMinutes = sessionHours * 60 + sessionMinutes;
      
      if (sessionDate < today) {
        // Past date - completed or missed
        status = 'completed';
      } else if (sessionDate === today) {
        // Today - check time
        if (currentTime > sessionEndTimeInMinutes) {
          status = 'completed';
        } else {
          status = 'upcoming';
        }
      } else {
        // Future date
        status = 'upcoming';
      }
      
      return {
        ...session,
        status,
        _id: session._id.toString() // Convert ObjectId to string for frontend
      };
    });
    
    // Sort sessions: upcoming first, then by date/time
    const sortedSessions = sessions.sort((a: any, b: any) => {
      // First sort by status priority (upcoming first, then completed)
      const statusPriority = { upcoming: 0, completed: 1, missed: 2 };
      const statusDiff = statusPriority[a.status as keyof typeof statusPriority] - statusPriority[b.status as keyof typeof statusPriority];
      
      if (statusDiff !== 0) return statusDiff;
      
      // Then sort by date (upcoming: earliest first, completed: latest first)
      if (a.status === 'upcoming') {
        // For upcoming sessions, show earliest first
        const dateDiff = a.date.localeCompare(b.date);
        if (dateDiff !== 0) return dateDiff;
        return a.startTime.localeCompare(b.startTime);
      } else {
        // For completed sessions, show latest first
        const dateDiff = b.date.localeCompare(a.date);
        if (dateDiff !== 0) return dateDiff;
        return b.startTime.localeCompare(a.startTime);
      }
    });

    return NextResponse.json({ sessions: sortedSessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { title, date, startTime, endTime, description, notifyBefore, userId } = body;

    // Validate required fields
    if (!title || !date || !startTime || !endTime || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create session object
    const session = {
      title,
      date,
      startTime,
      endTime,
      description: description || '',
      notifyBefore: parseInt(notifyBefore) || 15,
      userId,
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const result = await db.collection('sessions').insertOne(session);

    return NextResponse.json({ 
      message: 'Session created successfully',
      sessionId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

// PUT /api/sessions/:id - Update a session
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { sessionId, ...updateData } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const result = await db.collection('sessions').updateOne(
      { _id: new ObjectId(sessionId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

// DELETE /api/sessions/:id - Delete a session
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const result = await db.collection('sessions').deleteOne({ _id: new ObjectId(sessionId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
