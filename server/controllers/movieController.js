import Movie from '../models/movieModel.js';
import Review from '../models/reviewModel.js';

// GET ALL MOVIES (with search, genre, language filters)
export const getMovies = async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    const filter = {};

    if (search) {
      filter.movieName = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      filter.genres = { $in: [genre] };
    }

    if (language && language !== 'All') {
      filter.language = { $regex: new RegExp(`^${language}$`, 'i') };
    }

    const movies = await Movie.find(filter).sort({ releaseDate: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error('getMovies Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve movies.' });
  }
};

// GET MOVIE BY ID (with reviews)
export const getMovieById = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      movie,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch movie details.' });
  }
};

// CREATE MOVIE (Admin)
export const createMovie = async (req, res) => {
  try {
    const {
      movieName,
      description,
      genres,
      releaseDate,
      language,
      duration,
      certification,
      posterUrl,
      bannerUrl,
      trailerUrl,
      cast,
      director,
      rating,
    } = req.body;

    if (!movieName || !description || !genres || !releaseDate || !language || !duration) {
      return res.status(400).json({ success: false, message: 'Please provide all required movie fields.' });
    }

    const parsedGenres = Array.isArray(genres)
      ? genres
      : String(genres).split(',').map((g) => g.trim());

    const parsedCast = Array.isArray(cast)
      ? cast
      : cast ? String(cast).split(',').map((c) => c.trim()) : [];

    const movie = await Movie.create({
      movieName,
      description,
      genres: parsedGenres,
      releaseDate: new Date(releaseDate),
      language,
      duration,
      certification: certification || 'UA',
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: trailerUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      cast: parsedCast,
      director: director || 'Director',
      rating: rating ? Number(rating) : 8.0,
    });

    return res.status(201).json({
      success: true,
      message: 'Movie added successfully!',
      movie,
    });
  } catch (error) {
    console.error('createMovie Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to add movie.' });
  }
};

// UPDATE MOVIE (Admin)
export const updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const updated = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.status(200).json({ success: true, message: 'Movie updated successfully.', movie: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update movie.' });
  }
};

// DELETE MOVIE (Admin)
export const deleteMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const deleted = await Movie.findByIdAndDelete(movieId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete movie.' });
  }
};
