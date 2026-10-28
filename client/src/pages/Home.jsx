import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
  Search,
  Film,
  Sparkles,
  Filter,
  Ticket,
  Play,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clapperboard,
  Swords,
  Rocket,
  Theater,
  RefreshCw,
  SlidersHorizontal,
  ArrowDown,
  Layers,
  Star,
  Clock,
} from 'lucide-react';

const GENRES = [
  'All',
  'Action',
  'Adventure',
  'Sci-Fi',
  'Drama',
  'Animation',
  'Comedy',
  'Horror',
  'Fantasy',
  'Crime',
  'Thriller',
];

const LANGUAGES = ['All', 'English', 'Hindi'];

const SORT_OPTIONS = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest Releases', value: 'latest' },
  { label: 'Title (A-Z)', value: 'name' },
];

// Prime Video Horizontal Category Content Rail
const PrimeScrollRow = ({ section, onNavigate }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -620 : 620;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getSectionIcon = (id) => {
    switch (id) {
      case 'trending':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'now_showing':
        return <Clapperboard className="w-5 h-5 text-[#00A8E1]" />;
      case 'action':
        return <Swords className="w-5 h-5 text-rose-500" />;
      case 'scifi':
        return <Rocket className="w-5 h-5 text-purple-400" />;
      case 'drama':
        return <Theater className="w-5 h-5 text-emerald-400" />;
      default:
        return <Film className="w-5 h-5 text-[#00A8E1]" />;
    }
  };

  if (!section.movies || section.movies.length === 0) return null;

  return (
    <div className="space-y-3.5 relative group">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
            {getSectionIcon(section.id)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {section.title}
              </h3>
              {section.tag && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30">
                  {section.tag}
                </span>
              )}
            </div>
            {section.subtitle && (
              <p className="text-xs text-slate-400 hidden sm:block">
                {section.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
            className="p-2 rounded-full bg-[#131B2E] hover:bg-[#00A8E1] text-slate-300 hover:text-white border border-slate-700 transition-all shadow-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
            className="p-2 rounded-full bg-[#131B2E] hover:bg-[#00A8E1] text-slate-300 hover:text-white border border-slate-700 transition-all shadow-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {section.movies.map((movie, idx) => (
          <div
            key={movie._id}
            className="snap-start shrink-0 w-[160px] sm:w-[200px] md:w-[220px] group/card relative bg-[#131B2E] border border-slate-800 hover:border-[#00A8E1]/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#00A8E1]/20 transition-all duration-300 flex flex-col hover:scale-[1.03]"
          >
            {/* Poster container */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
              <img
                src={movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'}
                alt={movie.movieName}
                loading="lazy"
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131B2E] via-transparent to-black/40 opacity-80 group-hover/card:opacity-60 transition-opacity"></div>

              {/* Ranked Number Badge for Trending */}
              {section.id === 'trending' && (
                <div className="absolute bottom-2 left-2 font-black text-4xl sm:text-5xl text-white/90 drop-shadow-[0_4px_10px_rgba(0,168,225,0.7)] tracking-tighter">
                  #{idx + 1}
                </div>
              )}

              {/* Rating Pill */}
              <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-yellow-500/30 text-yellow-400 font-bold text-[11px] shadow-md">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}</span>
              </div>

              {/* Certification */}
              <div className="absolute top-2.5 right-2.5">
                <span className="bg-[#00A8E1] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded backdrop-blur-sm uppercase shadow-sm">
                  {movie.certification || 'UA'}
                </span>
              </div>

              {/* Duration */}
              <div className="absolute bottom-2.5 right-2.5 text-[10px] text-slate-300 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800 flex items-center space-x-1">
                <Clock className="w-2.5 h-2.5 text-[#00A8E1]" />
                <span>{movie.duration}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4
                  onClick={() => onNavigate(`/moviedetails/${movie._id}`)}
                  className="font-bold text-xs sm:text-sm text-white hover:text-[#00A8E1] transition-colors line-clamp-1 cursor-pointer"
                >
                  {movie.movieName}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {movie.genres?.join(' • ')}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigate(`/moviedetails/${movie._id}`)}
                  className="flex-1 text-center py-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
                >
                  Details
                </button>
                <button
                  onClick={() => onNavigate(`/movieshows/${movie._id}`)}
                  className="flex-1 flex items-center justify-center space-x-1 py-1.5 text-[11px] font-bold text-white bg-[#00A8E1] hover:bg-[#0092C5] rounded-lg shadow-md shadow-[#00A8E1]/25 transition-all hover:scale-105"
                >
                  <Ticket className="w-3 h-3" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Home = () => {
  const navigate = useNavigate();

  // Curated Content Rails State
  const [curatedSections, setCuratedSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  // Paginated Catalog Grid State
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  // TMDB Sync Modal & State
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [tmdbKeyInput, setTmdbKeyInput] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Infinite Scroll Observer Ref
  const observerRef = useRef(null);

  // 1. Fetch Prime Video Curated Content Sections
  const fetchCuratedSections = async () => {
    try {
      setSectionsLoading(true);
      const res = await api.get('/movie/curated/sections');
      if (res.data?.success) {
        setCuratedSections(res.data.sections || []);
      }
    } catch (err) {
      console.error('Error fetching curated sections:', err);
    } finally {
      setSectionsLoading(false);
    }
  };

  // 2. Fetch Paginated Movies
  const fetchPaginatedMovies = async (targetPage = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = {
        page: targetPage,
        limit,
        sort: sortBy,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;

      const res = await api.get('/movie', { params });
      if (res.data?.success) {
        const fetchedMovies = res.data.movies || [];
        setTotalCount(res.data.total ?? fetchedMovies.length);
        setHasMore(res.data.hasMore ?? false);
        setPage(targetPage);

        if (append) {
          setMovies((prev) => {
            // Deduplicate by _id
            const existingIds = new Set(prev.map((m) => m._id));
            const newUnique = fetchedMovies.filter((m) => !existingIds.has(m._id));
            return [...prev, ...newUnique];
          });
        } else {
          setMovies(fetchedMovies);
        }
      }
    } catch (err) {
      console.error('Error fetching paginated movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCuratedSections();
  }, []);

  // Filter & Search change handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPaginatedMovies(1, false);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedLanguage, sortBy]);

  // Load More Button Handler
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPaginatedMovies(page + 1, true);
    }
  };

  // Optional Infinite Scroll via Intersection Observer
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleLoadMore();
        }
      }, { threshold: 0.2 });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, page]
  );

  // Trigger TMDB Sync
  const handleSyncTMDB = async () => {
    try {
      setSyncing(true);
      const res = await api.post('/movie/sync-tmdb', {
        apiKey: tmdbKeyInput.trim() || undefined,
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'Catalog synchronized successfully!');
        setSyncModalOpen(false);
        fetchCuratedSections();
        fetchPaginatedMovies(1, false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sync movies from TMDB.');
    } finally {
      setSyncing(false);
    }
  };

  const featuredMovie = curatedSections[0]?.movies?.[0] || movies[0];
  const isFiltering = search.trim() !== '' || selectedGenre !== 'All' || selectedLanguage !== 'All';

  return (
    <div className="space-y-12">
      {/* Featured Spotlight Banner */}
      {featuredMovie && !isFiltering && (
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-12 border border-slate-800/80 shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-50 transform hover:scale-105 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage: `url(${featuredMovie.bannerUrl || featuredMovie.posterUrl})`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/65 to-transparent"></div>

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

      {/* Curated Content Rails (Amazon Prime Video Dark Aesthetic) */}
      {!isFiltering && !sectionsLoading && curatedSections.length > 0 && (
        <div className="space-y-10">
          {curatedSections.map((section) => (
            <PrimeScrollRow
              key={section.id}
              section={section}
              onNavigate={(path) => navigate(path)}
            />
          ))}
        </div>
      )}

      {/* Catalog Search, Filter & Controls Panel */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by movie title, star cast, director, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
            />
          </div>

          {/* Controls: Language, Sort & TMDB Sync */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Language dropdown */}
            <div className="flex items-center space-x-1.5 bg-[#0A0E17] border border-slate-700 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lang:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l} className="bg-[#0A0E17] text-white">
                    {l === 'All' ? 'All Languages' : l}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center space-x-1.5 bg-[#0A0E17] border border-slate-700 px-3 py-1.5 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00A8E1]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0A0E17] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* TMDB Sync Button */}
            <button
              onClick={() => setSyncModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-sky-900/60 to-blue-900/60 hover:from-[#00A8E1] hover:to-[#00509D] text-white text-xs font-bold rounded-xl border border-sky-500/30 flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
              title="Synchronize movie catalog with TMDB"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>Sync TMDB</span>
            </button>
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

      {/* Movies Grid Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-6 h-6 text-[#00A8E1]" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isFiltering ? 'Search & Filter Results' : 'Explore Entire Cinema Catalog'}
              </h2>
              <p className="text-xs text-slate-400">
                Book tickets across luxury theatres with real-time seat reservation
              </p>
            </div>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#131B2E] border border-slate-800 text-xs font-bold text-slate-300">
            <span className="text-[#00A8E1]">{movies.length}</span>
            <span>of</span>
            <span className="text-white">{totalCount}</span>
            <span>Movies Available</span>
          </div>
        </div>

        {loading && movies.length === 0 ? (
          <Loader message="Loading blockbuster collection..." />
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-[#131B2E] border border-slate-800 rounded-3xl space-y-3">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Movies Match Your Criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or selecting 'All' genres to browse our full catalog.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedGenre('All');
                setSelectedLanguage('All');
              }}
              className="px-4 py-2 bg-[#00A8E1] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#0092C5] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Responsive 5-Column Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {movies.map((movie, idx) => {
                const isLast = idx === movies.length - 1;
                return (
                  <div key={movie._id} ref={isLast ? lastMovieElementRef : null}>
                    <MovieCard movie={movie} />
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls / Load More */}
            <div className="pt-8 text-center space-y-4">
              {hasMore ? (
                <div className="space-y-2">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3.5 bg-[#131B2E] hover:bg-[#00A8E1] text-white font-extrabold rounded-2xl border border-slate-700 hover:border-[#00A8E1] shadow-xl hover:shadow-[#00A8E1]/25 transition-all inline-flex items-center space-x-2 active:scale-95 text-xs sm:text-sm disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#00A8E1]" />
                        <span>Loading Next Titles...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-4 h-4 text-[#00A8E1] group-hover:text-white" />
                        <span>Load More Movies ({totalCount - movies.length} remaining)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Scroll down or click the button to load more titles automatically
                  </p>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#131B2E] border border-slate-800 text-xs text-slate-400 font-semibold shadow-inner">
                  <span>🎬</span>
                  <span>You've reached the end of the catalog ({movies.length} movies loaded)</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* TMDB API Synchronization Modal */}
      {syncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#131B2E] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#00A8E1]/20 text-[#00A8E1] rounded-2xl border border-[#00A8E1]/30">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Synchronize TMDB Catalog</h3>
                <p className="text-xs text-slate-400">Fetch multi-page popular & now playing movies</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                iMovies supports multi-page synchronization directly from{' '}
                <strong className="text-white">The Movie Database (TMDB)</strong> API.
              </p>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">TMDB API Key (v3 auth):</label>
                <input
                  type="text"
                  placeholder="Enter TMDB API Key (or leave blank to sync 26+ built-in blockbusters)"
                  value={tmdbKeyInput}
                  onChange={(e) => setTmdbKeyInput(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A8E1]"
                />
                <span className="text-[10px] text-slate-400 block">
                  Leave blank to automatically populate the 26+ pre-configured HD blockbusters with cinema showtimes.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSyncModalOpen(false)}
                disabled={syncing}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSyncTMDB}
                disabled={syncing}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#00A8E1] hover:bg-[#0092C5] shadow-lg shadow-[#00A8E1]/30 transition-all flex items-center space-x-2"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <span>Sync Catalog Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
