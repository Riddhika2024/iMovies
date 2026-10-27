import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import {
  RefreshCw,
  Search,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import dayjs from 'dayjs';

export const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedTx, setSelectedTx] = useState(null);
  const [refundReason, setRefundReason] = useState('Customer Request');
  const [isRefunding, setIsRefunding] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/transactions');
      if (res.data?.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      toast.error('Failed to load transaction records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleIssueRefund = async () => {
    if (!selectedTx) return;

    try {
      setIsRefunding(true);
      const paymentId = selectedTx.paymentId || selectedTx.bookingId;
      const res = await api.post(`/admin/refund/${paymentId}`, {
        amount: selectedTx.totalAmount,
        reason: refundReason,
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Refund issued successfully!');
        setSelectedTx(null);
        fetchTransactions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process refund.');
    } finally {
      setIsRefunding(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <RotateCcw className="w-3 h-3" />
            <span>Refunded</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      tx.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      tx.movieTitle?.toLowerCase().includes(search.toLowerCase()) ||
      tx.paymentId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || tx.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#131B2E] p-4 rounded-2xl border border-slate-800">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Booking ID, Email, Movie, or Razorpay Payment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0A0E17] border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00A8E1] transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0A0E17] border border-slate-700 text-slate-300 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#00A8E1]"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Refunded">Refunded</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={fetchTransactions}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Refresh Transactions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00A8E1]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#131B2E] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0A0E17] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Movie & Theatre</th>
                <th className="py-3.5 px-4 font-semibold">Seats</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment ID</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#00A8E1]" />
                    Loading transaction ledger...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-[#00A8E1] font-bold">
                      #{tx.bookingId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white text-xs">{tx.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-semibold text-xs">{tx.movieTitle || 'Movie'}</div>
                      <div className="text-[10px] text-slate-400">{tx.theatreName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {tx.selectedSeats?.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{tx.totalAmount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {tx.paymentId ? (
                        <span className="text-sky-400 hover:underline">{tx.paymentId}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(tx.paymentStatus)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {dayjs(tx.createdAt).format('MMM D, YYYY h:mm A')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.paymentStatus === 'Completed' ? (
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-sky-500/15 hover:bg-[#00A8E1] text-[#00A8E1] hover:text-white border border-[#00A8E1]/30 rounded-xl text-xs font-semibold transition-all shadow-sm"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Issue Refund</span>
                        </button>
                      ) : tx.paymentStatus === 'Refunded' ? (
                        <span className="text-xs text-slate-500 italic">Refunded</span>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#131B2E] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-sky-400">
              <div className="p-3 bg-sky-500/10 rounded-full">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Issue Full Refund</h3>
                <p className="text-xs text-slate-400">Confirm payment reversal via Razorpay</p>
              </div>
            </div>

            <div className="bg-[#0A0E17] rounded-xl p-4 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Booking ID:</span>
                <span className="font-mono font-bold text-[#00A8E1]">#{selectedTx.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white font-medium">{selectedTx.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Movie & Seats:</span>
                <span className="text-white">{selectedTx.movieTitle} ({selectedTx.selectedSeats?.join(', ')})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refund Amount:</span>
                <span className="font-bold text-emerald-400 text-sm">₹{selectedTx.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment ID:</span>
                <span className="font-mono text-sky-400">{selectedTx.paymentId || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Reason for Refund
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-[#0A0E17] border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-[#00A8E1]"
              >
                <option value="Customer Cancellation">Customer Cancellation</option>
                <option value="Show Cancelled / Rescheduled">Show Cancelled / Rescheduled</option>
                <option value="Booking Mistake / Double Charge">Booking Mistake / Double Charge</option>
                <option value="Admin Moderation Reversal">Admin Moderation Reversal</option>
              </select>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              * Note: Processing refund will immediately mark this transaction as Refunded and release seats back to the public pool.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                disabled={isRefunding}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssueRefund}
                disabled={isRefunding}
                className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center space-x-2"
              >
                {isRefunding ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Confirm Refund</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
