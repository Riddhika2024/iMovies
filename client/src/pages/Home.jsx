import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { Search, Film, Sparkles, Filter, Ticket, Play } from 'lucide-react';

const GENRES = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Drama', 'Animation', 'Comedy'];
const LANGUAGES = ['All', 'English', 'Hindi'];

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;

      const res = await api.get('/movie', { params });
      if (res.data?.success) {
        setMovies(res.data.movies || []);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedLanguage]);

  const featuredMovie = movies[0];

  return (
    <div className="space-y-10">
      {/* Featured Prime Video Spotlight Banner */}
      {featuredMovie && !search && selectedGenre === 'All' && (
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-12 border border-slate-800/80 shadow-2xl">
          {/* Background image & gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-50 transform hover:scale-105 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage: `url(${featuredMovie.bannerUrl || featuredMovie.posterUrl})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/65 to-transparent"></div>

          {/* Banner content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-[#00A8E1]/90 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-md shadow-[#00A8E1]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending Blockbuster • Prime Pick</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {featuredMovie.movieName}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/movieshows/${featuredMovie._id}`)}
                className="px-6 py-3 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-lg shadow-[#00A8E1]/30 transition-all flex items-center space-x-2 hover:scale-105 text-xs sm:text-sm"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Tickets</span>
              </button>
              <button
                onClick={() => navigate(`/moviedetails/${featuredMovie._id}`)}
                className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-2 backdrop-blur-md text-xs sm:text-sm"
              >
                <Play className="w-4 h-4 text-[#00A8E1] fill-[#00A8E1]" />
                <span>Watch Trailer & Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movies by title, director, or actor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
            />
          </div>

          {/* Language filter dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-[#0A0E17] border border-slate-700 text-slate-300 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00A8E1]"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l === 'All' ? 'All Languages' : l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genre pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-[#00A8E1] shrink-0 ml-1 mr-1" />
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedGenre === g
                  ? 'bg-[#00A8E1] text-white shadow-md shadow-[#00A8E1]/30 scale-105'
                  : 'bg-[#0A0E17] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-[#00A8E1]" />
            <h2 className="text-xl sm:text-2xl font-black text-white">Now Showing in Cinemas</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {movies.length} {movies.length === 1 ? 'Movie' : 'Movies'} Available
          </span>
        </div>

        {loading ? (
          <Loader message="Fetching latest showtimes and trailers..." />
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-[#131B2E] border border-slate-800 rounded-3xl">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Movies Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or selecting a different genre filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
