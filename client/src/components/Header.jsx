import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Ticket,
  Heart,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0E17]/90 border-b border-slate-800/80 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Prime Video-Style Logo */}
          <Link to={user ? '/home' : '/landing'} className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A8E1] to-[#00509D] flex items-center justify-center shadow-lg shadow-[#00A8E1]/25 group-hover:scale-105 transition-transform duration-200">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#00A8E1] transition-colors">
                i<span className="text-[#00A8E1]">Movies</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1 hidden sm:inline-block">
                Tickets Made Simple
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
              <Link
                to="/home"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive('/home')
                    ? 'bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30 shadow-sm shadow-[#00A8E1]/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explore Movies</span>
              </Link>

              <Link
                to="/favoriteshows"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive('/favoriteshows')
                    ? 'bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30 shadow-sm shadow-[#00A8E1]/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Watchlist</span>
              </Link>

              <Link
                to="/bookings"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive('/bookings')
                    ? 'bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30 shadow-sm shadow-[#00A8E1]/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>My Tickets</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    location.pathname.startsWith('/admin') ||
                    isActive('/addmovie') ||
                    isActive('/addtheatre') ||
                    isActive('/addshow')
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : 'text-sky-400 hover:text-sky-300 hover:bg-sky-950/40'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/landing" className="text-xs font-semibold text-slate-300 hover:text-white">
                Features
              </Link>
              <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold text-white bg-[#00A8E1] hover:bg-[#0092C5] rounded-xl shadow-md shadow-[#00A8E1]/25 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* User Profile & Actions */}
          {user && (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#131B2E] hover:bg-[#1A253D] border border-slate-700/80 text-xs text-slate-200 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-[#00A8E1]/20 text-[#00A8E1] flex items-center justify-center font-bold text-xs uppercase border border-[#00A8E1]/30">
                  {user.username ? user.username.charAt(0) : 'U'}
                </div>
                <span className="font-semibold truncate max-w-[120px]">{user.username}</span>
                {isAdmin && (
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono font-bold border border-sky-500/30">
                    ADMIN
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-800 mb-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-sm">{user.username}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
                {isAdmin && (
                  <span className="text-[11px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold border border-sky-500/30">
                    ADMIN
                  </span>
                )}
              </div>
              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-[#00A8E1]"
              >
                Explore Movies
              </Link>
              <Link
                to="/favoriteshows"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-[#00A8E1]"
              >
                Watchlist
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-[#00A8E1]"
              >
                My Tickets
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                My Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-sky-400 hover:bg-sky-950/40"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-400 hover:bg-slate-800 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/landing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-white bg-[#00A8E1] text-center"
              >
                Create Free Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
