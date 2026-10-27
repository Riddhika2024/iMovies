import nodemailer from 'nodemailer';

// Create Nodemailer Transporter using Gmail SMTP
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || user.includes('your_gmail')) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send Booking Confirmation HTML Email
 */
export const sendBookingConfirmation = async ({
  toEmail,
  userName = 'Movie Fan',
  bookingId,
  movieTitle,
  theatreName,
  showDate,
  showTime,
  selectedSeats = [],
  totalAmount,
}) => {
  const seatsFormatted = selectedSeats.join(', ');
  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
      .container { max-width: 600px; margin: 20px auto; background-color: #121826; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .header { background: linear-gradient(135deg, #e50914, #b20710); padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800; color: #ffffff; }
      .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; }
      .content { padding: 30px; }
      .ticket-card { background: #1a2234; border: 2px dashed #e50914; border-radius: 12px; padding: 24px; position: relative; margin: 20px 0; }
      .movie-title { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
      .theatre-name { font-size: 15px; color: #94a3b8; margin-bottom: 18px; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
      .detail-item { font-size: 13px; }
      .detail-label { color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
      .detail-val { color: #f1f5f9; font-weight: 600; font-size: 15px; margin-top: 2px; }
      .seats-badge { background-color: #0b0f19; border: 1px solid #3b82f6; color: #60a5fa; padding: 6px 12px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 15px; }
      .total-row { border-top: 1px solid #334155; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; }
      .total-amount { font-size: 20px; font-weight: 800; color: #10b981; }
      .barcode-box { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #1e293b; }
      .barcode { letter-spacing: 6px; font-family: 'Courier New', monospace; font-size: 18px; color: #94a3b8; }
      .footer { background-color: #080c14; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🍿 iMovies</h1>
        <p>Movie ticket booking made simple</p>
      </div>
      <div class="content">
        <h2 style="color: #ffffff; margin-top: 0;">Booking Confirmed! 🎉</h2>
        <p style="color: #94a3b8; font-size: 14px;">Hi <strong>${userName}</strong>, get your popcorn ready! Your movie tickets have been secured.</p>

        <div class="ticket-card">
          <div class="movie-title">${movieTitle}</div>
          <div class="theatre-name">📍 ${theatreName}</div>

          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Date</div>
              <div class="detail-val">📅 ${showDate}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Time</div>
              <div class="detail-val">⏰ ${showTime}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Seats (${selectedSeats.length})</div>
              <div class="seats-badge">🎟️ ${seatsFormatted}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Booking ID</div>
              <div class="detail-val" style="font-family: monospace;">#${bookingId}</div>
            </div>
          </div>

          <div class="total-row">
            <span style="color: #94a3b8;">Total Paid:</span>
            <span class="total-amount">₹${totalAmount}</span>
          </div>
        </div>

        <div class="barcode-box">
          <p style="margin: 0 0 6px; font-size: 11px; color: #64748b;">SCAN DIGITAL PASS AT ENTRANCE</p>
          <div class="barcode">|||| |||| | ||||| |||| ||||</div>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Show this email or your iMovies Digital Ticket at the cinema</p>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} iMovies Inc. Need help? Contact support@imovies.com
      </div>
    </div>
  </body>
  </html>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email Service Simulation] Confirmation email to ${toEmail} for Booking #${bookingId}: Movie "${movieTitle}", Seats: ${seatsFormatted}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"iMovies Ticketing" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🍿 Booking Confirmed: ${movieTitle} [ID: #${bookingId}]`,
      html: emailHtml,
    });
    console.log(`[Email Service] Confirmation sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Service Error] Failed sending to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send Showtime Reminder Email (Cron Job)
 */
export const sendShowReminder = async ({
  toEmail,
  movieTitle,
  theatreName,
  showDate,
  showTime,
  seats,
  bookingId,
}) => {
  const transporter = createTransporter();
  const seatsFormatted = Array.isArray(seats) ? seats.join(', ') : seats;
  const emailHtml = `
    <div style="background:#0b0f19; color:#fff; padding:24px; font-family:sans-serif; max-width:550px; margin:auto; border-radius:12px; border:1px solid #1e293b;">
      <h2 style="color:#e50914; margin-top:0;">⏰ Showtime Reminder: ${movieTitle}</h2>
      <p style="color:#cbd5e1;">Your show starts soon! Please arrive 15 minutes early to grab your snacks and find your seats.</p>
      <div style="background:#1a2234; padding:16px; border-radius:8px; margin:16px 0;">
        <p><strong>Cinema:</strong> ${theatreName}</p>
        <p><strong>Showtime:</strong> ${showDate} at ${showTime}</p>
        <p><strong>Seats:</strong> ${seatsFormatted}</p>
        <p><strong>Booking ID:</strong> #${bookingId}</p>
      </div>
      <p style="font-size:12px; color:#64748b;">Enjoy your movie experience with iMovies!</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Reminder Simulation] To: ${toEmail} for "${movieTitle}" at ${showTime}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: `"iMovies Reminders" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `⏰ Upcoming Movie Reminder: ${movieTitle} at ${showTime}`,
      html: emailHtml,
    });
    return { success: true };
  } catch (err) {
    console.error(`[Reminder Error]`, err.message);
    return { success: false, error: err.message };
  }
};
