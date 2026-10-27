import Show from '../models/showModel.js';

/**
 * Sweeps all shows and releases seats whose lock timer (TTL) has expired.
 * Emits real-time updates via Socket.IO if available.
 */
export const cleanupExpiredSeatLocks = async (io = null) => {
  try {
    const now = new Date();
    // Find shows that have tickets
    const shows = await Show.find({});

    let totalReleased = 0;

    for (const show of shows) {
      if (!show.tickets) continue;

      let modified = false;
      const releasedSeats = [];

      for (const [seatId, seatData] of Object.entries(show.tickets)) {
        if (
          seatData &&
          seatData.status === 'locked' &&
          seatData.lockExpiresAt &&
          new Date(seatData.lockExpiresAt) < now
        ) {
          // Release seat back to available
          show.tickets[seatId] = {
            ...seatData,
            status: 'available',
            lockedBy: null,
            lockExpiresAt: null,
          };
          modified = true;
          totalReleased++;
          releasedSeats.push(seatId);
        }
      }

      if (modified) {
        show.markModified('tickets');
        await show.save();

        // Broadcast to clients in this show's room
        if (io) {
          io.to(`show_${show.showId}`).emit('seats_auto_released', {
            showId: show.showId,
            releasedSeats,
            tickets: show.tickets,
          });
        }
      }
    }

    if (totalReleased > 0) {
      console.log(`[Cleanup Service] Released ${totalReleased} expired seat lock(s) at ${now.toISOString()}`);
    }
  } catch (error) {
    console.error('[Cleanup Service Error]', error.message);
  }
};

export default cleanupExpiredSeatLocks;
