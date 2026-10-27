import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, 'Booking ID is required'],
      unique: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    showId: {
      type: String,
      required: [true, 'Show ID is required'],
      trim: true,
    },
    ticketsData: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Tickets data is required'],
    },
    selectedSeats: {
      type: [String],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    orderId: {
      type: String,
      default: '',
    },
    paymentId: {
      type: String,
      default: '',
    },
    signature: {
      type: String,
      default: '',
    },
    refundId: {
      type: String,
      default: '',
    },
    refundedAt: {
      type: Date,
    },
    movieTitle: {
      type: String,
      default: '',
    },
    theatreName: {
      type: String,
      default: '',
    },
    showDate: {
      type: String,
      default: '',
    },
    showTime: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
