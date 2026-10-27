import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import AdminTransactions from '../components/AdminTransactions';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Ticket,
  Film,
  Building,
  Users,
  PlusCircle,
  RotateCcw,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings || []);
      }
    } catch (err) {
      console.error('Error loading admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return <Loader message="Compiling real-time platform metrics and transactions..." />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-sky-500/15 text-sky-400 border border-sky-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Platform Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics, Razorpay transaction management, automated seat allocation, and cinema catalog.
          </p>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/addmovie"
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#00A8E1] hover:bg-[#0092C5] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#00A8E1]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Movie</span>
          </Link>
          <Link
            to="/addtheatre"
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <Building className="w-4 h-4 text-sky-400" />
            <span>Add Cinema</span>
          </Link>
          <Link
            to="/addshow"
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Schedule Show</span>
          </Link>
          <Link
            to="/addadmin"
            className="flex items-center space-x-1.5 px-3 py-2 bg-sky-950/60 hover:bg-sky-900/60 text-sky-200 rounded-xl text-xs font-bold transition-all border border-sky-700"
          >
            <Users className="w-4 h-4 text-sky-300" />
            <span>New Admin</span>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#00A8E1] text-white shadow-md shadow-[#00A8E1]/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'transactions'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Transactions & Refunds (Razorpay)
        </button>
      </div>

      {activeTab === 'transactions' ? (
        <AdminTransactions />
      ) : (
        <div className="space-y-8">
          {/* Key Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-[#131B2E] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Platform Revenue</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">₹{stats?.netRevenue || 0}</div>
                <span className="text-[10px] text-slate-500">Gross: ₹{stats?.totalRevenue || 0}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Active Bookings */}
            <div className="bg-[#131B2E] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Bookings</span>
                <div className="text-2xl font-black text-white mt-1">{stats?.activeBookings || 0}</div>
                <span className="text-[10px] text-sky-400">{stats?.refundedCount || 0} Refunded</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00A8E1]/15 border border-[#00A8E1]/30 text-[#00A8E1] flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
            </div>

            {/* Movies Catalog */}
            <div className="bg-[#131B2E] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Movies in Screening</span>
                <div className="text-2xl font-black text-white mt-1">{stats?.totalMovies || 0}</div>
                <span className="text-[10px] text-slate-500">{stats?.totalShows || 0} Active Shows</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Film className="w-6 h-6" />
              </div>
            </div>

            {/* Cinema Halls */}
            <div className="bg-[#131B2E] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Theatres</span>
                <div className="text-2xl font-black text-white mt-1">{stats?.totalTheatres || 0}</div>
                <span className="text-[10px] text-slate-500">{stats?.totalUsers || 0} Users</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-[#00A8E1]" />
                <span>Recent Platform Bookings</span>
              </h2>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-semibold text-[#00A8E1] hover:underline flex items-center space-x-1"
              >
                <span>Manage all transactions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0A0E17] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Booking ID</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Movie</th>
                    <th className="py-3 px-4 font-semibold">Seats</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-xs">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No reservations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono text-[#00A8E1] font-bold">
                          #{b.bookingId}
                        </td>
                        <td className="py-3 px-4">{b.userEmail}</td>
                        <td className="py-3 px-4 text-white font-semibold">{b.movieTitle}</td>
                        <td className="py-3 px-4 text-emerald-400">{b.selectedSeats?.join(', ')}</td>
                        <td className="py-3 px-4 font-bold text-white">₹{b.totalAmount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.paymentStatus === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : b.paymentStatus === 'Refunded'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {b.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
