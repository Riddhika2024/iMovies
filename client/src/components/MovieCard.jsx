import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Heart, Ticket } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export const MovieCard = ({ movie, isFavoriteInitial = false, onFavoriteChange }) => {
  const [isFav, setIsFav] = useState(isFavoriteInitial);
  const [favLoading, setFavLoading] = useState(false);
  const navigate = useNavigate();

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setFavLoading(true);
      const res = await api.post('/favorite/toggle', { movieId: movie._id });
      if (res.data?.success) {
        setIsFav(res.data.isFavorite);
        toast.success(res.data.message);
        if (onFavoriteChange) onFavoriteChange(movie._id, res.data.isFavorite);
      }
    } catch (err) {
      toast.error('Sign in to save movies to your watchlist.');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="group relative bg-[#131B2E] border border-slate-800 hover:border-[#00A8E1]/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#00A8E1]/15 transition-all duration-300 flex flex-col hover:scale-[1.02]">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
          alt={movie.movieName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-black/40 opacity-90 group-hover:opacity-75 transition-opacity"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-yellow-500/30 text-yellow-400 font-bold text-xs shadow-md">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}</span>
        </div>

        {/* Certification & Watchlist Pill */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          <span className="bg-[#00A8E1] text-white text-[10px] font-extrabold px-2 py-0.5 rounded backdrop-blur-sm uppercase shadow-sm">
            {movie.certification || 'UA'}
          </span>
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isFav
                ? 'bg-[#00A8E1]/20 border-[#00A8E1] text-[#00A8E1]'
                : 'bg-black/60 border-slate-700 text-slate-300 hover:text-[#00A8E1]'
            }`}
            title="Add to watchlist"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-[#00A8E1]' : ''}`} />
          </button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
          <Clock className="w-3 h-3 text-[#00A8E1]" />
          <span>{movie.duration}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-200">{movie.language}</span>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            to={`/moviedetails/${movie._id}`}
            className="font-bold text-base text-white hover:text-[#00A8E1] transition-colors line-clamp-1"
          >
            {movie.movieName}
          </Link>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genres?.slice(0, 3).map((g, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/80"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-2 flex items-center space-x-2">
          <Link
            to={`/moviedetails/${movie._id}`}
            className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-xl transition-colors border border-slate-700"
          >
            Details
          </Link>
          <button
            onClick={() => navigate(`/movieshows/${movie._id}`)}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-bold text-white bg-[#00A8E1] hover:bg-[#0092C5] rounded-xl shadow-md shadow-[#00A8E1]/25 transition-all hover:scale-[1.02]"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
