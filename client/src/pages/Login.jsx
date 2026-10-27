import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Film, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || (isAdminMode ? '/admin' : '/home');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const endpoint = isAdminMode ? '/auth/admin/login' : '/auth/login';
      const res = await api.post(endpoint, { email, password });

      if (res.data?.success) {
        toast.success(res.data.message || 'Logged in successfully!');
        const userData = isAdminMode ? res.data.admin : res.data.user;
        login(res.data.token, userData);
        navigate(isAdminMode ? '/admin' : from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = () => {
    setIsAdminMode(false);
    setEmail('user@imovies.com');
    setPassword('user123');
  };

  const fillDemoAdmin = () => {
    setIsAdminMode(true);
    setEmail('admin@imovies.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${isAdminMode ? 'from-sky-500 to-indigo-600' : 'from-[#00A8E1] to-sky-400'}`}></div>

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg ${isAdminMode ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-[#00A8E1]/20 text-[#00A8E1] border border-[#00A8E1]/30'}`}>
            {isAdminMode ? <ShieldCheck className="w-6 h-6" /> : <Film className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black text-white">
            {isAdminMode ? 'Admin Portal Sign In' : 'Sign In to iMovies'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAdminMode ? 'Access platform controls, revenue & transactions' : 'Book tickets, manage your watchlist and reservations'}
          </p>

          {/* Toggle Role */}
          <div className="mt-4 inline-flex p-1 bg-[#0A0E17] rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                !isAdminMode ? 'bg-[#00A8E1] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(true)}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                isAdminMode ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Administrator
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
              isAdminMode
                ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/30'
                : 'bg-[#00A8E1] hover:bg-[#0092C5] shadow-[#00A8E1]/30'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fill Helper */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick One-Click Demo Access:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={fillDemoUser}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-2.5 py-1 text-[11px] font-semibold bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 rounded-lg border border-sky-800"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00A8E1] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
