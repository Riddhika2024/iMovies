import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Phone, ShieldCheck, Ticket, LogOut, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, isAdmin, logout } = useAuth();
  const [bookingCount, setBookingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/bookings/user');
        if (res.data?.success) {
          setBookingCount(res.data.bookings?.length || 0);
        }
      } catch (err) {
        // silent
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#00A8E1] to-[#00509D] text-white flex items-center justify-center font-black text-2xl uppercase shadow-lg shadow-[#00A8E1]/25 border border-[#00A8E1]/30">
            {user?.username ? user.username[0] : 'U'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-2xl font-black text-white">{user?.username}</h1>
              {isAdmin && (
                <span className="bg-sky-500/20 text-sky-300 text-xs px-2 py-0.5 rounded-full font-bold border border-sky-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#0A0E17] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Username</span>
            <div className="text-white font-semibold flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#00A8E1]" />
              <span>{user?.username}</span>
            </div>
          </div>

          <div className="bg-[#0A0E17] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Email ID</span>
            <div className="text-white font-semibold flex items-center space-x-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>

          <div className="bg-[#0A0E17] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1">Phone Number</span>
            <div className="text-white font-semibold flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user?.phone || '+91 Unlinked'}</span>
            </div>
          </div>
        </div>

        {/* Activity & Bookings */}
        <div className="mt-6 p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-[#00A8E1]/20 text-[#00A8E1]">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Movie Reservations</div>
              <div className="text-xs text-slate-400">{bookingCount} Tickets Booked</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/bookings')}
            className="text-xs font-bold px-4 py-2 bg-[#00A8E1] hover:bg-[#0092C5] text-white rounded-xl transition-all shadow-md shadow-[#00A8E1]/20"
          >
            View Tickets
          </button>
        </div>

        {/* Sign Out */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center space-x-2 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 px-4 py-2.5 rounded-xl border border-rose-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of iMovies</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
