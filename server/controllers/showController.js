import mongoose from 'mongoose';
import Show from '../models/showModel.js';
import Theatre from '../models/theatreModel.js';
import Movie from '../models/movieModel.js';

// GET SHOWS BY MOVIE ID (Optionally filtered by showDate)
export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const query = { movieId };
    if (date) {
      query.showDate = date;
    }

    const shows = await Show.find(query).sort({ showDate: 1, showTime: 1 });

    // Group shows by Theatre for beautiful UX
    const grouped = {};
    shows.forEach((s) => {
      if (!grouped[s.theatreName]) {
        grouped[s.theatreName] = {
          theatreName: s.theatreName,
          theatreId: s.theatreId,
          shows: [],
        };
      }
      grouped[s.theatreName].shows.push(s);
    });

    return res.status(200).json({
      success: true,
      shows,
      groupedByTheatre: Object.values(grouped),
    });
  } catch (error) {
    console.error('getShowsByMovie Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve shows for movie.' });
  }
};

// GET SINGLE SHOW DETAILS (including live tickets map)
export const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = mongoose.Types.ObjectId.isValid(showId)
      ? await Show.findOne({ $or: [{ showId }, { _id: showId }] })
      : await Show.findOne({ showId });

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const movie = await Movie.findById(show.movieId);
    const theatre = await Theatre.findOne({ $or: [{ theatreName: show.theatreName }, { theatreId: show.theatreId }] });

    return res.status(200).json({
      success: true,
      show,
      movie,
      theatre,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load show details.' });
  }
};

// CREATE SHOW (Admin)
export const createShow = async (req, res) => {
  try {
    const { adminEmail, movieId, theatreName, showDate, showTime } = req.body;

    if (!movieId || !theatreName || !showDate || !showTime) {
      return res.status(400).json({ success: false, message: 'Please provide all show scheduling details.' });
    }

    const theatre = await Theatre.findOne({ theatreName });
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Selected theatre was not found.' });
    }

    const cleanTime = String(showTime).replace(/[\s:]/g, '');
    const generatedShowId = `SHOW-${movieId.slice(-4)}-${theatre.theatreId || 'T'}-${showDate}-${cleanTime}`;

    // Initialize seat tickets from theatre tiers
    const tickets = {};
    const balconyRows = theatre.balconySeats?.rows || ['A', 'B'];
    const middleRows = theatre.middleSeats?.rows || ['C', 'D', 'E'];
    const lowerRows = theatre.lowerSeats?.rows || ['F', 'G'];
    const cols = theatre.balconySeats?.cols || 10;

    balconyRows.forEach((r) => {
      for (let c = 1; c <= cols; c++) {
        tickets[`${r}${c}`] = { status: 'available', price: theatre.balconySeatPrice, tier: 'balcony' };
      }
    });

    middleRows.forEach((r) => {
      for (let c = 1; c <= cols; c++) {
        tickets[`${r}${c}`] = { status: 'available', price: theatre.middleSeatPrice, tier: 'middle' };
      }
    });

    lowerRows.forEach((r) => {
      for (let c = 1; c <= cols; c++) {
        tickets[`${r}${c}`] = { status: 'available', price: theatre.lowerSeatPrice, tier: 'lower' };
      }
    });

    const newShow = await Show.create({
      adminEmail: adminEmail || req.user?.email || 'admin@imovies.com',
      showId: generatedShowId,
      movieId,
      theatreName,
      theatreId: theatre.theatreId,
      showDate,
      showTime,
      tickets,
    });

    return res.status(201).json({
      success: true,
      message: 'Show scheduled successfully!',
      show: newShow,
    });
  } catch (error) {
    console.error('createShow Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create show schedule.' });
  }
};

// DELETE SHOW (Admin)
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;
    if (mongoose.Types.ObjectId.isValid(showId)) {
      await Show.findOneAndDelete({ $or: [{ showId }, { _id: showId }] });
    } else {
      await Show.findOneAndDelete({ showId });
    }
    return res.status(200).json({ success: true, message: 'Show schedule deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete show.' });
  }
};
