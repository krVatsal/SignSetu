import { NextResponse } from 'next/server';
import { getCronJobStatus } from '../../../lib/cronJob';

export async function GET() {
  try {
    const status = getCronJobStatus();
    
    return NextResponse.json({
      success: true,
      cronJob: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting CRON job status:', error);
    return NextResponse.json(
      { error: 'Failed to get CRON job status' },
      { status: 500 }
    );
  }
}
