import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing. Please check your environment variables.');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

export const sendSessionReminderEmail = async (
  email: string,
  sessionDetails: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    description?: string;
  }
): Promise<boolean> => {
  const { title, date, startTime, endTime, description } = sessionDetails;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .session-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Quiet Hour Reminder</h1>
          <p>Your focused work session is starting soon!</p>
        </div>
        <div class="content">
          <h2>Session Details</h2>
          <div class="session-details">
            <h3>${title}</h3>
            <p><strong>📅 Date:</strong> ${date}</p>
            <p><strong>⏰ Time:</strong> ${startTime} - ${endTime}</p>
            ${description ? `<p><strong>📝 Description:</strong> ${description}</p>` : ''}
          </div>
          <p>Your quiet hour session will begin in 10 minutes. Make sure to:</p>
          <ul>
            <li>🔕 Turn off notifications on your devices</li>
            <li>📱 Put your phone in silent mode</li>
            <li>🚪 Close your door or use headphones</li>
            <li>💧 Have water and any materials ready</li>
          </ul>
          <p>Focus well and make the most of your dedicated time!</p>
        </div>
        <div class="footer">
          <p>Sent by QuietHours - Smart Focus Time Management</p>
          <p>This is an automated reminder for your scheduled session.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Quiet Hour Reminder
    
    Your focused work session "${title}" is starting soon!
    
    Date: ${date}
    Time: ${startTime} - ${endTime}
    ${description ? `Description: ${description}` : ''}
    
    Your session will begin in 10 minutes. Make sure to prepare your workspace for focused work.
    
    - QuietHours Team
  `;

  return sendEmail({
    to: email,
    subject: `🔔 Reminder: "${title}" starts in 10 minutes`,
    html,
    text,
  });
};
