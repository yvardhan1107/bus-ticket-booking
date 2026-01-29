import nodemailer from 'nodemailer';

// Create transporter with email configuration
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email service not configured - emails will not be sent');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generate HTML email template for booking confirmation
const generateBookingEmailHTML = (booking) => {
  const departureDate = new Date(booking.route.departureTime).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const departureTime = new Date(booking.route.departureTime).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const passengersList = booking.passengerDetails
    .map((p, i) => `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${i + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.age}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.gender}</td>
    </tr>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚌 Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your bus ticket has been successfully booked</p>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #666;">Booking ID</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #7c3aed;">${booking._id}</p>
        </div>

        <h2 style="color: #333; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; margin-top: 25px;">Journey Details</h2>
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0;">
          <div style="text-align: center; flex: 1;">
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${booking.route.origin}</p>
            <p style="color: #666; margin: 5px 0 0;">Departure</p>
          </div>
          <div style="text-align: center; padding: 0 20px;">
            <p style="font-size: 20px; color: #7c3aed;">→</p>
          </div>
          <div style="text-align: center; flex: 1;">
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${booking.route.destination}</p>
            <p style="color: #666; margin: 5px 0 0;">Arrival</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background: #f8f9fa; border-radius: 5px;">
              <strong>📅 Date:</strong> ${departureDate}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin-top: 5px;">
              <strong>🕐 Time:</strong> ${departureTime}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f8f9fa; border-radius: 5px;">
              <strong>🚌 Bus:</strong> ${booking.route.bus?.busName || 'N/A'} (${booking.route.bus?.busType || 'AC'})
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f8f9fa; border-radius: 5px;">
              <strong>💺 Seat(s):</strong> ${booking.seatNumbers.join(', ')}
            </td>
          </tr>
        </table>

        <h2 style="color: #333; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; margin-top: 25px;">Passenger Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: #7c3aed; color: white;">
              <th style="padding: 10px; text-align: left;">#</th>
              <th style="padding: 10px; text-align: left;">Name</th>
              <th style="padding: 10px; text-align: left;">Age</th>
              <th style="padding: 10px; text-align: left;">Gender</th>
            </tr>
          </thead>
          <tbody>
            ${passengersList}
          </tbody>
        </table>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Total Amount Paid</p>
          <p style="color: white; font-size: 32px; font-weight: bold; margin: 10px 0 0;">₹${booking.totalAmount}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #fff8e1; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="color: #f57c00; margin: 0 0 10px;">Important Instructions</h3>
          <ul style="color: #666; margin: 0; padding-left: 20px;">
            <li>Please arrive at the boarding point 15 minutes before departure</li>
            <li>Carry a valid ID proof for verification</li>
            <li>Show this email or booking ID at the time of boarding</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Thank you for choosing our service!<br>
            For any queries, contact us at support@busbooking.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send booking confirmation email
export const sendBookingConfirmation = async (booking, userEmail) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email not sent - email service not configured');
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎫 Booking Confirmed - ${booking.route.origin} to ${booking.route.destination}`,
      html: generateBookingEmailHTML(booking),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
};

export default { sendBookingConfirmation };
