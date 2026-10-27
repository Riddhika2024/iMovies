import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  ChevronRight,
  Info,
} from 'lucide-react';

export const MovieShows = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [groupedTheatres, setGroupedTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate 5 consecutive dates starting today
  const dateOptions = Array.from({ length: 5 }).map((_, idx) => {
    const d = dayjs().add(idx, 'day');
    return {
      dateStr: d.format('YYYY-MM-DD'),
      displayDay: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.format('ddd'),
      displayDate: d.format('D MMM'),
    };
  });

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].dateStr);

  const fetchShowsData = async () => {
    try {
      setLoading(true);
      const movieRes = await api.get(`/movie/${movieId}`);
      if (movieRes.data?.success) {
        setMovie(movieRes.data.movie);
      }

      const showsRes = await api.get(`/shows/movie/${movieId}?date=${selectedDate}`);
      if (showsRes.data?.success) {
        setGroupedTheatres(showsRes.data.groupedByTheatre || []);
      }
    } catch (err) {
      toast.error('Failed to load show schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowsData();
  }, [movieId, selectedDate]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Movie Banner Strip */}
      {movie && (
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <img
              src={movie.posterUrl}
              alt={movie.movieName}
              className="w-16 h-24 object-cover rounded-xl border border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black bg-[#00A8E1] text-white px-2 py-0.5 rounded uppercase">
                  {movie.certification || 'UA'}
                </span>
                <span className="text-xs text-slate-400">{movie.language} • {movie.duration}</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">{movie.movieName}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{movie.genres?.join(', ')}</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/moviedetails/${movie._id}`)}
            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            View Movie Details
          </button>
        </div>
      )}

      {/* Date Selector Ribbon */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center space-x-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#00A8E1]" />
          <span>Select Date</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {dateOptions.map((opt) => {
            const isSelected = selectedDate === opt.dateStr;
            return (
              <button
                key={opt.dateStr}
                onClick={() => setSelectedDate(opt.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[90px] py-3 px-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#00A8E1] border-[#00A8E1] text-white shadow-lg shadow-[#00A8E1]/30 scale-105'
                    : 'bg-[#0A0E17] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">{opt.displayDay}</span>
                <span className="text-sm font-black mt-0.5">{opt.displayDate}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theatres and Showtimes List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-[#00A8E1]" />
            <span>Available Cinema Theatres</span>
          </h2>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Available</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span>Fast Filling</span>
            </span>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading available cinema halls and showtimes..." />
        ) : groupedTheatres.length === 0 ? (
          <div className="p-12 bg-[#131B2E] border border-slate-800 rounded-3xl text-center">
            <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Shows Available for this Date</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Please choose another date or check back later as cinema halls update their screening schedules daily.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTheatres.map((group, idx) => (
              <div
                key={idx}
                className="bg-[#131B2E] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl space-y-4 transition-colors"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#00A8E1] shrink-0" />
                      <span>{group.theatreName}</span>
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 pl-6">
                      <span className="text-[#00A8E1] font-semibold">4K Laser Dolby Atmos</span>
                      <span>•</span>
                      <span>M-Ticket Available</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    <span>Non-cancellable after 1hr prior to show</span>
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {group.shows.map((show) => (
                    <button
                      key={show.showId}
                      onClick={() => navigate(`/seatslug/${show.showId}`)}
                      className="group relative px-5 py-3 rounded-xl bg-[#0A0E17] hover:bg-[#00A8E1] border border-slate-700 hover:border-[#00A8E1] text-left transition-all hover:scale-105 shadow-md"
                    >
                      <div className="text-sm font-black text-emerald-400 group-hover:text-white">
                        {show.showTime}
                      </div>
                      <div className="text-[10px] text-slate-400 group-hover:text-sky-100 uppercase tracking-wider font-semibold mt-0.5">
                        4K Dolby 7.1
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieShows;
