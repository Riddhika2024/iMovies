import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    movieName: {
      type: String,
      required: [true, 'Movie name is required'],
      trim: true,
      minlength: [2, 'Movie name must be at least 2 characters'],
      maxlength: [200, 'Movie name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A movie must have at least one genre.',
      },
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
    duration: {
      type: String, // e.g. "2h 45m" or "165 mins"
      required: [true, 'Duration is required'],
    },
    certification: {
      type: String,
      default: 'UA',
    },
    posterUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: 'Unknown',
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
export default Movie;
