// Import this module to initialize database connection on server startup
import './mongodb';
import { startCronJob } from './cronJob';

// Initialize CRON job for email reminders
if (typeof window === 'undefined') {
  // Only run on server-side
  setTimeout(() => {
    startCronJob();
  }, 2000); // Wait 2 seconds for database to be ready
}

console.log('🚀 Server startup initialization completed');
