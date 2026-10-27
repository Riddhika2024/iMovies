import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Building, ArrowLeft, Plus } from 'lucide-react';

export const AddTheatre = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    theatreName: '',
    theatreId: `THTR-${Math.floor(100 + Math.random() * 900)}`,
    location: '',
    balconySeatPrice: 450,
    middleSeatPrice: 320,
    lowerSeatPrice: 200,
    cols: 10,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.theatreName || !formData.location) {
      toast.warning('Please enter theatre name and location.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/theatre', formData);
      if (res.data?.success) {
        toast.success('Cinema hall created successfully!');
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register theatre.');
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
          <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Register Cinema Theatre</h1>
            <p className="text-xs text-slate-400">Configure hall layout and tier pricing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Cinema Name *</label>
            <input
              type="text"
              name="theatreName"
              required
              value={formData.theatreName}
              onChange={handleChange}
              placeholder="e.g. PVR ICON: Phoenix Palladium"
              className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Unique Identifier</label>
              <input
                type="text"
                name="theatreId"
                required
                value={formData.theatreId}
                onChange={handleChange}
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 font-mono focus:outline-none focus:border-[#00A8E1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">City / Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Lower Parel, Mumbai"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Seat Pricing Configuration (INR)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-purple-400 font-semibold mb-1">
                  Balcony (Rows A-B)
                </label>
                <input
                  type="number"
                  name="balconySeatPrice"
                  required
                  value={formData.balconySeatPrice}
                  onChange={handleChange}
                  className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-[#00A8E1]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#00A8E1] font-semibold mb-1">
                  Middle (Rows C-E)
                </label>
                <input
                  type="number"
                  name="middleSeatPrice"
                  required
                  value={formData.middleSeatPrice}
                  onChange={handleChange}
                  className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-[#00A8E1]"
                />
              </div>

              <div>
                <label className="block text-xs text-cyan-400 font-semibold mb-1">
                  Lower (Rows F-G)
                </label>
                <input
                  type="number"
                  name="lowerSeatPrice"
                  required
                  value={formData.lowerSeatPrice}
                  onChange={handleChange}
                  className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-[#00A8E1]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-xl shadow-[#00A8E1]/30 transition-all text-xs sm:text-sm mt-4"
          >
            {loading ? 'Registering Cinema...' : 'Register Cinema Theatre'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTheatre;
