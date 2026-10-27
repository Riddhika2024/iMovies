import React from 'react';
import AdminTransactions from '../components/AdminTransactions';
import { Ticket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminBookings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/admin')}
        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 rounded-2xl bg-[#00A8E1]/15 text-[#00A8E1] border border-[#00A8E1]/30">
          <Ticket className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">All Platform Reservations</h1>
          <p className="text-xs text-slate-400">
            Monitor real-time customer bookings, inspect payment IDs, and issue Razorpay refunds
          </p>
        </div>
      </div>

      <AdminTransactions />
    </div>
  );
};

export default AdminBookings;
