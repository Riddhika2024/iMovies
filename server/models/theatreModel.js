import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema(
  {
    theatreName: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    theatreId: {
      type: String,
      required: [true, 'Theatre ID is required'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Theatre location is required'],
      trim: true,
    },
    balconySeatPrice: {
      type: Number,
      required: [true, 'Balcony seat price is required'],
      min: 0,
    },
    middleSeatPrice: {
      type: Number,
      required: [true, 'Middle seat price is required'],
      min: 0,
    },
    lowerSeatPrice: {
      type: Number,
      required: [true, 'Lower seat price is required'],
      min: 0,
    },
    // Seat configurations: rows, cols, layout metadata
    balconySeats: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Balcony seats configuration is required'],
    },
    middleSeats: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Middle seats configuration is required'],
    },
    lowerSeats: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Lower seats configuration is required'],
    },
  },
  { timestamps: true }
);

const Theatre = mongoose.models.Theatre || mongoose.model('Theatre', theatreSchema);
export default Theatre;
