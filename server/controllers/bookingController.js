import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Show from '../models/showModel.js';

const findShowSafely = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Show.findOne({ $or: [{ showId: id }, { _id: id }] });
  }
  return await Show.findOne({ showId: id });
};

// LOCK SEATS TEMPORARILY (TTL: 10 mins)
export const lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userEmail = req.user.email;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid show ID or seat selection.' });
    }

    const show = await findShowSafely(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const now = new Date();
    const ttlMinutes = 10;
    const lockExpiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const conflictingSeats = [];

    // Verify all requested seats are available
    for (const seatId of seats) {
      const seat = show.tickets?.[seatId];
      if (!seat) continue;

      if (seat.status === 'booked') {
        conflictingSeats.push({ seatId, reason: 'Already booked' });
      } else if (
        seat.status === 'locked' &&
        seat.lockedBy &&
        seat.lockedBy !== userEmail &&
        seat.lockExpiresAt &&
        new Date(seat.lockExpiresAt) > now
      ) {
        conflictingSeats.push({ seatId, reason: 'Held by another customer' });
      }
    }

    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Some seats are no longer available.',
        conflictingSeats,
      });
    }

    // Apply lock
    for (const seatId of seats) {
      if (show.tickets?.[seatId]) {
        show.tickets[seatId].status = 'locked';
        show.tickets[seatId].lockedBy = userEmail;
        show.tickets[seatId].lockExpiresAt = lockExpiresAt;
      }
    }

    show.markModified('tickets');
    await show.save();

    // Broadcast through socket if available on req.app
    const io = req.app.get('io');
    if (io) {
      io.to(`show_${show.showId}`).emit('seats_locked', {
        showId: show.showId,
        seats,
        lockedBy: userEmail,
        lockExpiresAt,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Seats locked successfully for 10 minutes.',
      lockedSeats: seats,
      lockExpiresAt,
    });
  } catch (error) {
    console.error('lockSeats Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to lock seats.' });
  }
};

// UNLOCK / RELEASE SEATS
export const unlockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userEmail = req.user.email;

    const show = await findShowSafely(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const releasedSeats = [];
    for (const seatId of seats) {
      const seat = show.tickets?.[seatId];
      if (seat && (seat.lockedBy === userEmail || req.user.role === 'admin') && seat.status === 'locked') {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockExpiresAt = null;
        releasedSeats.push(seatId);
      }
    }

    show.markModified('tickets');
    await show.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`show_${show.showId}`).emit('seats_released', {
        showId: show.showId,
        releasedSeats,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Seats unlocked successfully.',
      releasedSeats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to release seats.' });
  }
};

// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user bookings.' });
  }
};

// GET BOOKING DETAILS BY ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.userEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking.' });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving booking.' });
  }
};

// CANCEL BOOKING (User)
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.userEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
    }

    if (booking.paymentStatus === 'Cancelled' || booking.paymentStatus === 'Refunded') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled or refunded.' });
    }

    booking.paymentStatus = 'Cancelled';
    await booking.save();

    // Free up seats in Show
    const show = await Show.findOne({ showId: booking.showId });
    if (show && show.tickets) {
      booking.selectedSeats.forEach((seatId) => {
        if (show.tickets[seatId]) {
          show.tickets[seatId].status = 'available';
          show.tickets[seatId].lockedBy = null;
          show.tickets[seatId].lockExpiresAt = null;
        }
      });
      show.markModified('tickets');
      await show.save();

      const io = req.app.get('io');
      if (io) {
        io.to(`show_${show.showId}`).emit('seats_released', {
          showId: show.showId,
          releasedSeats: booking.selectedSeats,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been made available.',
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error cancelling booking.' });
  }
};
