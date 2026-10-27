import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Film, User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 3 || username.length > 20) {
      toast.warning('Username must be between 3 and 20 characters.');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        phone,
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Account created successfully!');
        login(res.data.token, res.data.user);
        navigate('/home', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00A8E1] via-sky-400 to-[#00509D]"></div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-[#00A8E1]/20 text-[#00A8E1] border border-[#00A8E1]/30 shadow-lg">
            <Film className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Join iMovies</h2>
          <p className="text-xs text-slate-400 mt-1">
            Book tickets in seconds, lock seats in real-time & get WhatsApp passes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Username (3-20 chars)</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cinelover"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone (for WhatsApp Tickets)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[#0A0E17] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password (Min 6 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#00A8E1] hover:bg-[#0092C5] shadow-lg shadow-[#00A8E1]/30 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00A8E1] font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
