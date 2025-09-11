import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendReminders } from '../../../../lib/cronJob';

export async function GET(request: NextRequest) {
  try {
    // Verify this is being called by Vercel Cron (optional security check)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔔 Vercel CRON job triggered for email reminders');
    
    // Run the reminder check
    await checkAndSendReminders();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reminder check completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in CRON job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Also allow POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
