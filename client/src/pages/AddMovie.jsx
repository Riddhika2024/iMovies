import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Film, Plus, Image, Clock, Calendar, ArrowLeft } from 'lucide-react';

export const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    movieName: '',
    description: '',
    genres: 'Action, Sci-Fi',
    releaseDate: '2026-11-01',
    language: 'English',
    duration: '2h 30m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    cast: 'Lead Actor, Supporting Actress',
    director: 'Visionary Director',
    rating: 8.5,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movieName || !formData.description) {
      toast.warning('Please fill in required movie title and synopsis.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/movie', formData);
      if (res.data?.success) {
        toast.success('Movie created successfully!');
        navigate('/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add movie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/admin')}
        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Create Movie Listing</h1>
            <p className="text-xs text-slate-400">Add a new film to the iMovies catalog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Movie Title *</label>
              <input
                type="text"
                name="movieName"
                required
                value={formData.movieName}
                onChange={handleChange}
                placeholder="e.g. Gladiator II"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Language *</label>
              <input
                type="text"
                name="language"
                required
                value={formData.language}
                onChange={handleChange}
                placeholder="English / Hindi"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Synopsis / Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Film plot overview..."
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Genres (comma-separated)</label>
              <input
                type="text"
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                placeholder="Action, Sci-Fi"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="2h 30m"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Certification</label>
              <input
                type="text"
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                placeholder="U, UA, A"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Critic Rating (1-10)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Poster Image URL</label>
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Banner / Backdrop URL</label>
              <input
                type="url"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Trailer YouTube Link</label>
            <input
              type="url"
              name="trailerUrl"
              value={formData.trailerUrl}
              onChange={handleChange}
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-xl shadow-[#00A8E1]/30 transition-all text-xs sm:text-sm mt-4"
          >
            {loading ? 'Creating Movie Listing...' : 'Publish Movie to Catalog'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
