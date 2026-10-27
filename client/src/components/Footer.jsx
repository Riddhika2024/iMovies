import React from 'react';
import { Film, Shield, Zap, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#070B14] border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00A8E1] to-[#00509D] flex items-center justify-center shadow-md shadow-[#00A8E1]/20">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white">
              i<span className="text-[#00A8E1]">Movies</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Movie ticket booking made simple. Real-time live seat locking, seamless UPI & card payments via Razorpay test mode, automated digital tickets, and instant notifications.
          </p>
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay Verified</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-[#00A8E1]" />
              <span>Live Socket.IO Sync</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Full-Stack MERN</span>
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/home" className="hover:text-[#00A8E1] transition-colors">Now Showing</a></li>
            <li><a href="/bookings" className="hover:text-[#00A8E1] transition-colors">My Bookings</a></li>
            <li><a href="/favoriteshows" className="hover:text-[#00A8E1] transition-colors">Saved Watchlist</a></li>
            <li><a href="/profile" className="hover:text-[#00A8E1] transition-colors">Account Profile</a></li>
          </ul>
        </div>

        {/* Support & Admin */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase mb-3">Platform & Admin</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/admin" className="hover:text-sky-400 transition-colors">Admin Dashboard</a></li>
            <li><a href="/admin/transactions" className="hover:text-sky-400 transition-colors">Transactions & Refunds</a></li>
            <li><a href="/addmovie" className="hover:text-sky-400 transition-colors">Add New Movie</a></li>
            <li><a href="/addtheatre" className="hover:text-sky-400 transition-colors">Add Cinema Hall</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} iMovies Platform. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Engineered with React, Vite, Express, Mongoose, TailwindCSS & Razorpay.</p>
      </div>
    </footer>
  );
};

export default Footer;
