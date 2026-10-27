import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { ShieldCheck, UserPlus, Lock, Mail, User, ArrowLeft } from 'lucide-react';

export const AddAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username.length < 3) {
      toast.warning('Username must be at least 3 characters.');
      return;
    }
    if (formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/admin/register', formData);
      if (res.data?.success) {
        toast.success('New administrator registered successfully!');
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Create Admin Account</h1>
            <p className="text-xs text-slate-400">Grant administrative control to sub-admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="username"
                required
                minLength={3}
                maxLength={20}
                value={formData.username}
                onChange={handleChange}
                placeholder="opsadmin"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ops@imovies.com"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Secret Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-xl shadow-[#00A8E1]/30 transition-all text-xs sm:text-sm mt-4"
          >
            {loading ? 'Creating...' : 'Grant Admin Privileges'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
