import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Ticket,
  Zap,
  Shield,
  Smartphone,
  ChevronRight,
  Star,
  Users,
  Compass,
} from 'lucide-react';

export const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-24">
      {/* Prime Video Hero Billboard */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#00A8E1]/15 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[280px] bg-[#00509D]/20 blur-[110px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#131B2E]/90 border border-[#00A8E1]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 mb-8 backdrop-blur-md shadow-md shadow-[#00A8E1]/10">
            <span className="w-2 h-2 rounded-full bg-[#00A8E1] animate-ping"></span>
            <span>Prime Cinema Experience • Real-Time Seat Allocation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8E1] via-sky-400 to-cyan-300">iMovies</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Your ultimate destination for the latest blockbusters and timeless classics. Real-time seat reservation, seamless UPI checkout, and instant digital tickets delivered straight to WhatsApp & Email.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/home')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-bold rounded-xl shadow-xl shadow-[#00A8E1]/25 transition-all flex items-center justify-center space-x-2 hover:scale-105"
              >
                <Compass className="w-5 h-5" />
                <span>Go to Now Showing</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-bold rounded-xl shadow-xl shadow-[#00A8E1]/25 transition-all flex items-center justify-center space-x-2 hover:scale-105"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Get Started — Book Seats</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#131B2E]/90 hover:bg-[#1A253D] text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-3xl font-black text-white">4K Dolby</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Premium Experience</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#00A8E1]">100% Live</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Real-time Seat Lock</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-400">Razorpay</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">UPI / Card Gateway</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400">Instant</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">WhatsApp & Email Passes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">Why Cinephiles Love iMovies</h2>
          <p className="text-slate-400 mt-3 text-sm">
            Engineered from ground up with modern high-concurrency architecture and Prime Video cinematic UX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#131B2E] border border-slate-800 hover:border-[#00A8E1]/40 p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#00A8E1]/15 text-[#00A8E1] flex items-center justify-center mb-6 border border-[#00A8E1]/30">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Seat Locking (TTL)</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              When you pick a seat, it is securely locked for 10 minutes across all connected users via Socket.IO WebSocket broadcasts. No double-booking, guaranteed.
            </p>
          </div>

          <div className="bg-[#131B2E] border border-slate-800 hover:border-emerald-500/40 p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Razorpay & UPI Payments</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enjoy lightning-fast payments with Google Pay, PhonePe, Paytm, QR Codes, and Cards verified with HMAC-SHA256 cryptographic signatures.
            </p>
          </div>

          <div className="bg-[#131B2E] border border-slate-800 hover:border-sky-500/40 p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-6 border border-sky-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">WhatsApp & Email Delivery</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated Nodemailer cinema pass sent right to your inbox, plus 1-click sharing of formatted tickets to WhatsApp with seat and booking details.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#131B2E] to-[#0A0E17] border border-[#00A8E1]/30 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Ready for tonight's blockbuster?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Choose from luxury recliner seats, IMAX experiences, and Dolby Atmos audio across top premier theatres.
            </p>
          </div>
          <Link
            to={user ? '/home' : '/register'}
            className="px-8 py-4 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-extrabold rounded-xl shadow-xl shadow-[#00A8E1]/30 transition-all hover:scale-105 shrink-0"
          >
            Explore Now Showing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
