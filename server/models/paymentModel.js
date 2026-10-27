import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      default: '',
    },
    bookingId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
      default: 'created',
    },
    signature: {
      type: String,
      default: '',
    },
    method: {
      type: String,
      default: 'upi/card',
    },
    refundDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;
