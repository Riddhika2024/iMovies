import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: [true, 'Admin email is required'],
      lowercase: true,
      trim: true,
    },
    showId: {
      type: String,
      required: [true, 'Show ID is required'],
      unique: true,
      trim: true,
    },
    movieId: {
      type: String,
      required: [true, 'Movie ID is required'],
      trim: true,
    },
    theatreName: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    theatreId: {
      type: String,
      trim: true,
    },
    showDate: {
      type: String, // Stored as "YYYY-MM-DD" or Date
      required: [true, 'Show date is required'],
    },
    showTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "07:00 PM"
      required: [true, 'Show time is required'],
    },
    // tickets dictionary / object mapping seatId to { status, lockedBy, lockExpiresAt, price, tier }
    tickets: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Show = mongoose.models.Show || mongoose.model('Show', showSchema);
export default Show;
