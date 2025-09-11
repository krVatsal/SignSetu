# QuietHours - Smart Focus Time Management

A modern web application for scheduling focused work sessions with intelligent notifications. Built with Next.js, Supabase, and MongoDB.

## Features

- 🔐 **Secure Authentication** - Sign up/sign in with Supabase Auth
- ⏰ **Smart Scheduling** - Create conflict-free quiet hours
- 📧 **Email Notifications** - Get reminded 10 minutes before your focus session
- 📊 **Analytics Dashboard** - Track your productivity patterns
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL) + MongoDB
- **Email**: Nodemailer
- **CRON Jobs**: node-cron

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account
- A MongoDB database
- An email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd quiet-hours-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # MongoDB Configuration
   MONGODB_URI=your-mongodb-connection-string
   MONGODB_DB=quiet_hours_scheduler

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Go to Settings > API to get your URL and keys
   - Authentication is handled automatically

5. **Set up MongoDB**
   - Create a MongoDB database (local or cloud)
   - User data will be automatically synced when users sign up

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/auth/sync-user/     # API route for MongoDB user sync
│   ├── auth/                   # Authentication pages
│   │   ├── signin/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/              # Protected dashboard page
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── page.tsx                # Landing page
├── components/
│   └── Navigation.tsx          # Navigation component
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── lib/
│   ├── mongodb.ts              # MongoDB connection
│   └── supabase.ts             # Supabase client
└── middleware.ts               # Route protection middleware
```

## Authentication Flow

1. **Sign Up**: New users create an account with Supabase Auth
2. **User Sync**: User data is automatically synced to MongoDB
3. **Dashboard Access**: Authenticated users can access the dashboard
4. **Session Management**: Auth state is managed globally with React Context

## Current Features Implemented

✅ **Authentication System**
- Sign up with email/password
- Sign in with existing account
- Password reset functionality
- Protected routes
- User session management

✅ **UI/UX**
- Modern landing page with orange branding
- Responsive design
- Interactive buttons and navigation
- Professional dashboard layout

✅ **Database Integration**
- Supabase for authentication
- MongoDB for user data and scheduling
- Automatic user data synchronization

## Next Steps

🚧 **Coming Soon**
- Quiet hour scheduling functionality
- CRON job email notifications
- Calendar integration
- Analytics and reporting
- Team collaboration features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
