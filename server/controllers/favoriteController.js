import Favorite from '../models/favoriteModel.js';
import Movie from '../models/movieModel.js';

// TOGGLE FAVORITE (Add or Remove)
export const toggleFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userEmail = req.user.email;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required.' });
    }

    const existing = await Favorite.findOne({ userEmail, movieId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({ success: true, isFavorite: false, message: 'Removed from favorites.' });
    }

    await Favorite.create({ userEmail, movieId });
    return res.status(201).json({ success: true, isFavorite: true, message: 'Added to favorites!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating favorites.' });
  }
};

// GET USER FAVORITES
export const getUserFavorites = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const favorites = await Favorite.find({ userEmail }).sort({ createdAt: -1 });

    const movieIds = favorites.map((f) => f.movieId);
    const movies = await Movie.find({ _id: { $in: movieIds } });

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve favorites.' });
  }
};
