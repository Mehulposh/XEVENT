const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send registration confirmation email
const sendRegistrationEmail = async (userEmail, userName, eventTitle, eventDate) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Registration Confirmed: ${eventTitle}`,
      html: `
        <h2>Event Registration Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>You have successfully registered for the event: <strong>${eventTitle}</strong></p>
        <p>Event Date: ${new Date(eventDate).toLocaleDateString()}</p>
        <p>We look forward to seeing you at the event!</p>
        <br>
        <p>Best regards,</p>
        <p>Events App Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send cancellation email
const sendCancellationEmail = async (userEmail, userName, eventTitle) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Registration Cancelled: ${eventTitle}`,
      html: `
        <h2>Event Registration Cancelled</h2>
        <p>Dear ${userName},</p>
        <p>Your registration for the event: <strong>${eventTitle}</strong> has been cancelled.</p>
        <p>If this was a mistake, you can register again through our platform.</p>
        <br>
        <p>Best regards,</p>
        <p>Events App Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send event creation notification to admin
const sendEventCreationNotification = async (adminEmail, eventTitle, organizerName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `New Event Created: ${eventTitle}`,
      html: `
        <h2>New Event Notification</h2>
        <p>A new event has been created on the platform.</p>
        <p>Event Title: <strong>${eventTitle}</strong></p>
        <p>Organizer: ${organizerName}</p>
        <p>Please review and approve if necessary.</p>
        <br>
        <p>Events App Admin Panel</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendRegistrationEmail,
  sendCancellationEmail,
  sendEventCreationNotification,
};