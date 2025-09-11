import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { userId, email, fullName } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {
      // Update existing user
      await usersCollection.updateOne(
        { userId },
        {
          $set: {
            email,
            fullName,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Create new user
      await usersCollection.insertOne({
        userId,
        email,
        fullName,
        createdAt: new Date(),
        updatedAt: new Date(),
        quietHours: [], // Array to store scheduled quiet hours
        preferences: {
          emailNotifications: true,
          reminderMinutes: 10,
          timezone: 'UTC',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing user with MongoDB:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
