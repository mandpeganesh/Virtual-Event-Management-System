import nodemailer from 'nodemailer';
import { logger } from './logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to Virtual Event Management',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for registering with our Virtual Event Management platform.</p>
        <p>You can now start exploring events and managing your registrations.</p>
      `
    });
    logger.info(`Welcome email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    // Don't throw error to prevent registration process from failing
  }
};

export const sendEventRegistrationEmail = async (email, eventTitle) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <h1>Event Registration Confirmed</h1>
        <p>You have successfully registered for: ${eventTitle}</p>
        <p>We look forward to seeing you at the event!</p>
      `
    });
    logger.info(`Event registration email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending event registration email:', error);
  }
};