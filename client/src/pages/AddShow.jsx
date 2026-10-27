import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Calendar, Clock, Film, Building, ArrowLeft } from 'lucide-react';

export const AddShow = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);

  const [formData, setFormData] = useState({
    movieId: '',
    theatreName: '',
    showDate: dayjs().format('YYYY-MM-DD'),
    showTime: '06:15 PM',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mRes, tRes] = await Promise.all([
          api.get('/movie'),
          api.get('/theatre'),
        ]);
        if (mRes.data?.success) setMovies(mRes.data.movies || []);
        if (tRes.data?.success) setTheatres(tRes.data.theatres || []);
        if (mRes.data?.movies?.length > 0) {
          setFormData((prev) => ({ ...prev, movieId: mRes.data.movies[0]._id }));
        }
        if (tRes.data?.theatres?.length > 0) {
          setFormData((prev) => ({ ...prev, theatreName: tRes.data.theatres[0].theatreName }));
        }
      } catch (err) {
        toast.error('Failed to load movies or cinema options.');
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movieId || !formData.theatreName) {
      toast.warning('Please select a movie and theatre.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/shows', formData);
      if (res.data?.success) {
        toast.success('Show scheduled successfully!');
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule show.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/admin')}
        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Schedule Show Screening</h1>
            <p className="text-xs text-slate-400">Link movie to cinema theatre and showtime</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Movie *</label>
            <select
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
            >
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.movieName} ({m.language} - {m.duration})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Cinema Theatre *</label>
            <select
              name="theatreName"
              value={formData.theatreName}
              onChange={handleChange}
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
            >
              {theatres.map((t) => (
                <option key={t._id} value={t.theatreName}>
                  {t.theatreName} ({t.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Show Date</label>
              <input
                type="date"
                name="showDate"
                required
                value={formData.showDate}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Show Time</label>
              <select
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
              >
                <option value="10:30 AM">10:30 AM (Morning Show)</option>
                <option value="02:00 PM">02:00 PM (Matinee)</option>
                <option value="06:15 PM">06:15 PM (Evening Premiere)</option>
                <option value="09:45 PM">09:45 PM (Night Blockbuster)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-xl shadow-[#00A8E1]/30 transition-all text-xs sm:text-sm mt-4"
          >
            {loading ? 'Creating Show...' : 'Confirm Show Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShow;
