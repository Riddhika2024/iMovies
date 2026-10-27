import Review from '../models/reviewModel.js';
import Movie from '../models/movieModel.js';

// ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const { movieId, rating, reviewText } = req.body;
    const userEmail = req.user.email;
    const username = req.user.username || userEmail.split('@')[0];

    if (!movieId || rating == null || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please provide movie ID, rating, and review text.' });
    }

    const review = await Review.create({
      userEmail,
      username,
      movieId,
      rating: Number(rating),
      reviewText,
    });

    // Update average rating for movie
    const allReviews = await Review.find({ movieId });
    const avgRating = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    await Movie.findByIdAndUpdate(movieId, { rating: Number(avgRating) });

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review,
      newAverageRating: avgRating,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to post review.' });
  }
};

// GET REVIEWS FOR MOVIE
export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve reviews.' });
  }
};
