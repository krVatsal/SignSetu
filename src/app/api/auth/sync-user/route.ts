import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection is established
    const db = await getDatabase();
    
    const { userId, email, fullName } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }
    
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ userId });

    if (existingUser) {
      // Update existing user, preserving emailNotifications if it exists
      const updateData: Record<string, unknown> = {
        email,
        fullName,
        updatedAt: new Date(),
      };
      
      // If user doesn't have emailNotifications field, add it
      if (!existingUser.hasOwnProperty('emailNotifications')) {
        updateData.emailNotifications = true;
        updateData.reminderMinutes = 10;
      }
      
      await usersCollection.updateOne(
        { userId },
        { $set: updateData }
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
        emailNotifications: true, // Direct field for easier access
        reminderMinutes: 10,
        timezone: 'UTC',
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
