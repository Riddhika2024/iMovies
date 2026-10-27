/**
 * Generates an emoji-rich formatted WhatsApp message and returns the wa.me share URL.
 */
export const generateWhatsAppShareLink = ({
  bookingId,
  movieTitle,
  theatreName,
  showDate,
  showTime,
  selectedSeats = [],
  totalAmount,
}) => {
  const seatsStr = Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats;

  const message = [
    `🎟️ *iMovies Booking Confirmed!* 🍿`,
    ``,
    `🎬 *Movie:* ${movieTitle}`,
    `📍 *Cinema:* ${theatreName}`,
    `📅 *Date:* ${showDate}`,
    `⏰ *Time:* ${showTime}`,
    `💺 *Seats (${selectedSeats.length}):* ${seatsStr}`,
    `💳 *Amount Paid:* ₹${totalAmount}`,
    `🔖 *Booking ID:* #${bookingId}`,
    ``,
    `⚡ Book your movie tickets effortlessly with *iMovies*! 🚀`,
  ].join('\n');

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export default generateWhatsAppShareLink;
