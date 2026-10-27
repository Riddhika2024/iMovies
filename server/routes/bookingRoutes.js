import express from 'express';
import {
  lockSeats,
  unlockSeats,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.js';
import fetchUser from '../middlewares/fetchUser.js';

const router = express.Router();

router.post('/lock-seats', fetchUser, lockSeats);
router.post('/unlock-seats', fetchUser, unlockSeats);
router.get('/user', fetchUser, getUserBookings);
router.get('/:bookingId', fetchUser, getBookingById);
router.post('/cancel/:bookingId', fetchUser, cancelBooking);

export default router;
