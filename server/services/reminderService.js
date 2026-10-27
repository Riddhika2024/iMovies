import Booking from '../models/bookingModel.js';
import Show from '../models/showModel.js';
import Movie from '../models/movieModel.js';
import { sendShowReminder } from './emailService.js';
import dayjs from 'dayjs';

/**
 * Checks for completed bookings whose show is scheduled within the next few hours / today,
 * and sends reminder emails.
 */
export const checkUpcomingShowsAndRemind = async () => {
  try {
    const todayStr = dayjs().format('YYYY-MM-DD');
    
    // Find active completed bookings for today
    const upcomingBookings = await Booking.find({
      paymentStatus: 'Completed',
      showDate: todayStr,
    });

    for (const booking of upcomingBookings) {
      // Send reminder email
      await sendShowReminder({
        toEmail: booking.userEmail,
        movieTitle: booking.movieTitle || 'Your Movie',
        theatreName: booking.theatreName || 'iMovies Cinema',
        showDate: booking.showDate,
        showTime: booking.showTime,
        seats: booking.selectedSeats,
        bookingId: booking.bookingId,
      });
    }

    if (upcomingBookings.length > 0) {
      console.log(`[Reminder Service] Processed reminders for ${upcomingBookings.length} booking(s).`);
    }
  } catch (error) {
    console.error('[Reminder Service Error]', error.message);
  }
};

export default checkUpcomingShowsAndRemind;
