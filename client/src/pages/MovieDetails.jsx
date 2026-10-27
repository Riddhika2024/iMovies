import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Ticket,
  MessageSquare,
  Send,
  UserCheck,
  Play,
  Heart,
} from 'lucide-react';
import dayjs from 'dayjs';

export const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(9);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Watchlist State
  const [isFav, setIsFav] = useState(false);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/movie/${movieId}`);
      if (res.data?.success) {
        setMovie(res.data.movie);
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      toast.error('Failed to load movie details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [movieId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.warning('Please write a short review before submitting.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post('/review', {
        movieId,
        rating: Number(rating),
        reviewText,
      });

      if (res.data?.success) {
        toast.success('Your review was posted!');
        setReviewText('');
        fetchMovieData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Please sign in to write a review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await api.post('/favorite/toggle', { movieId });
      if (res.data?.success) {
        setIsFav(res.data.isFavorite);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Please sign in to save movies.');
    }
  };

  if (loading) {
    return <Loader message="Loading movie details and critic reviews..." />;
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-4 py-2 bg-[#00A8E1] text-white rounded-xl text-xs font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Movie Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#131B2E] border border-slate-800 shadow-2xl">
        {/* Backdrop Background */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.35]"
          style={{
            backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-[#131B2E]/75 to-transparent"></div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-56 sm:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-900 mx-auto md:mx-0">
            <img
              src={movie.posterUrl}
              alt={movie.movieName}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00A8E1] text-white font-black text-xs px-2.5 py-1 rounded-md uppercase shadow-sm">
                {movie.certification || 'UA'}
              </span>
              <div className="flex items-center space-x-1 bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-md text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}/10</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">({reviews.length} Critic Reviews)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {movie.movieName}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-[#00A8E1]" />
                <span>{movie.duration}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>{movie.language}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{dayjs(movie.releaseDate).format('MMMM D, YYYY')}</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genres?.map((g) => (
                <span
                  key={g}
                  className="bg-slate-800/90 text-slate-200 border border-slate-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Synopsis</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Director & Cast */}
            <div className="pt-2 space-y-1 text-xs text-slate-400">
              {movie.director && (
                <p>
                  <strong className="text-white">Director:</strong> {movie.director}
                </p>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <p>
                  <strong className="text-white">Cast:</strong> {movie.cast.join(', ')}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(`/movieshows/${movie._id}`)}
                className="px-8 py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-xl shadow-[#00A8E1]/30 transition-all flex items-center space-x-2 hover:scale-105 text-xs sm:text-sm"
              >
                <Ticket className="w-4 h-4" />
                <span>Select Showtime & Book Seats</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className="px-4 py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-semibold flex items-center space-x-2 transition-colors text-xs sm:text-sm"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-[#00A8E1] text-[#00A8E1]' : ''}`} />
                <span>Watchlist</span>
              </button>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-semibold flex items-center space-x-2 transition-colors text-xs sm:text-sm"
                >
                  <Play className="w-4 h-4 text-[#00A8E1] fill-[#00A8E1]" />
                  <span>Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post a Review Card */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#00A8E1]" />
            <span>Rate & Review</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Share your cinematic verdict with fellow moviegoers.
          </p>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Rating (1 to 10 Stars)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full accent-[#00A8E1]"
                />
                <span className="font-extrabold text-yellow-400 text-xs px-2 py-1 bg-yellow-500/15 rounded border border-yellow-500/30">
                  {rating} ★
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Your Review
              </label>
              <textarea
                required
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you think of the cinematography, sound design, and acting?"
                className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-2.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-bold rounded-xl shadow-md shadow-[#00A8E1]/25 transition-all flex items-center justify-center space-x-2 text-xs"
            >
              {submittingReview ? (
                <span>Posting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>Audience Reviews ({reviews.length})</span>
            </h3>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 bg-[#131B2E] border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
              No reviews posted yet. Be the first to share your verdict!
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-[#131B2E] border border-slate-800 rounded-2xl p-5 shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00A8E1]/20 text-[#00A8E1] font-bold flex items-center justify-center text-xs border border-[#00A8E1]/30">
                        {rev.username ? rev.username[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="text-white text-xs font-semibold">{rev.username}</div>
                        <div className="text-[10px] text-slate-500">
                          {dayjs(rev.createdAt).format('MMM D, YYYY')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold border border-yellow-500/20">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      <span>{rev.rating}/10</span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed pl-10">
                    {rev.reviewText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
