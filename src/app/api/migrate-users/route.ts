import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import mongoose from 'mongoose';

export async function POST() {
  try {
    await dbConnect();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const usersCollection = db.collection('users');

    // Update all users to have direct emailNotifications field
    const result = await usersCollection.updateMany(
      { 
        emailNotifications: { $exists: false } // Only update users who don't have the direct field
      },
      {
        $set: {
          emailNotifications: true, // Enable by default
          reminderMinutes: 10, // Default reminder time
          updatedAt: new Date()
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} users with email notification settings`);

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} users with email notification settings`
    });
  } catch (error) {
    console.error('Error migrating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to migrate user settings' },
      { status: 500 }
    );
  }
}
