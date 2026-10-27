import mongoose from 'mongoose';
import Theatre from '../models/theatreModel.js';

// GET ALL THEATRES
export const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, theatres });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve theatres.' });
  }
};

// GET THEATRE BY ID
export const getTheatreById = async (req, res) => {
  try {
    const { theatreId } = req.params;
    const theatre = mongoose.Types.ObjectId.isValid(theatreId)
      ? await Theatre.findOne({ $or: [{ theatreId }, { _id: theatreId }] })
      : await Theatre.findOne({ theatreId });
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }
    return res.status(200).json({ success: true, theatre });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch theatre.' });
  }
};

// CREATE THEATRE (Admin)
export const createTheatre = async (req, res) => {
  try {
    const {
      theatreName,
      theatreId,
      location,
      balconySeatPrice,
      middleSeatPrice,
      lowerSeatPrice,
      balconyRows = ['A', 'B'],
      middleRows = ['C', 'D', 'E'],
      lowerRows = ['F', 'G'],
      cols = 10,
    } = req.body;

    if (!theatreName || !theatreId || !location || balconySeatPrice == null || middleSeatPrice == null || lowerSeatPrice == null) {
      return res.status(400).json({ success: false, message: 'Please provide all required theatre details.' });
    }

    const existing = await Theatre.findOne({ theatreId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Theatre with this ID already exists.' });
    }

    // Helper to generate seat tier objects
    const buildTier = (rows) => {
      const seats = {};
      rows.forEach((r) => {
        for (let c = 1; c <= cols; c++) {
          seats[`${r}${c}`] = { available: true };
        }
      });
      return { rows, cols, seats };
    };

    const balconySeats = req.body.balconySeats || buildTier(balconyRows);
    const middleSeats = req.body.middleSeats || buildTier(middleRows);
    const lowerSeats = req.body.lowerSeats || buildTier(lowerRows);

    const theatre = await Theatre.create({
      theatreName,
      theatreId,
      location,
      balconySeatPrice: Number(balconySeatPrice),
      middleSeatPrice: Number(middleSeatPrice),
      lowerSeatPrice: Number(lowerSeatPrice),
      balconySeats,
      middleSeats,
      lowerSeats,
    });

    return res.status(201).json({
      success: true,
      message: 'Theatre created successfully!',
      theatre,
    });
  } catch (error) {
    console.error('createTheatre Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create theatre.' });
  }
};

// DELETE THEATRE
export const deleteTheatre = async (req, res) => {
  try {
    const { id } = req.params;
    await Theatre.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Theatre removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete theatre.' });
  }
};
