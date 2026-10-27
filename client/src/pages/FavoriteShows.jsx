import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { Heart, Compass } from 'lucide-react';

export const FavoriteShows = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/favorite');
      if (res.data?.success) {
        setMovies(res.data.movies || []);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (movieId, isFav) => {
    if (!isFav) {
      setMovies((prev) => prev.filter((m) => m._id !== movieId));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2">
            <Heart className="w-7 h-7 text-[#00A8E1] fill-[#00A8E1]" />
            <span>My Movie Watchlist</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of all blockbusters you're excited to see on the big screen.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading your favorite movies..." />
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-[#131B2E] border border-slate-800 rounded-3xl p-8">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click the heart icon on any movie card to save it here for easy booking later.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 px-6 py-2.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-2 mx-auto shadow-md shadow-[#00A8E1]/25"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Movies</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              isFavoriteInitial={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteShows;
