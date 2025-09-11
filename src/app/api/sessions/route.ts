import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/sessions - Get all sessions for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const sessions = await db.collection('sessions').find({ userId }).sort({ date: 1, startTime: 1 }).toArray();

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
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

    const db = await getDatabase();
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
    const body = await request.json();
    const { sessionId, ...updateData } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
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
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
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
