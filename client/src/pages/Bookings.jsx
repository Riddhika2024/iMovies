import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import { generateWhatsAppShareLink } from '../utils/whatsappHelper';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
  Ticket,
  Printer,
  Share2,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/user');
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      toast.error('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await api.post(`/bookings/cancel/${bookingId}`);
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchBookings();
        if (activeTicket?.bookingId === bookingId) {
          setActiveTicket(null);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error cancelling booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2">
            <Ticket className="w-7 h-7 text-[#00A8E1]" />
            <span>My Bookings & Digital Tickets</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your cinema passes, print tickets, or share them directly to WhatsApp.
          </p>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="text-xs font-bold px-4 py-2 bg-[#00A8E1] hover:bg-[#0092C5] text-white rounded-xl shadow-md shadow-[#00A8E1]/25 transition-all"
        >
          Book More Shows
        </button>
      </div>

      {loading ? (
        <Loader message="Loading your cinema reservations..." />
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-[#131B2E] border border-slate-800 rounded-3xl p-8">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Tickets Booked Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't reserved any movies yet. Explore today's blockbusters and grab your seats!
          </p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 px-6 py-2.5 bg-[#00A8E1] hover:bg-[#0092C5] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-[#00A8E1]/25"
          >
            Explore Now Showing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => {
            const isCompleted = b.paymentStatus === 'Completed';
            const isCancelled = b.paymentStatus === 'Cancelled';
            const isRefunded = b.paymentStatus === 'Refunded';

            const waLink = generateWhatsAppShareLink({
              bookingId: b.bookingId,
              movieTitle: b.movieTitle || 'Movie',
              theatreName: b.theatreName || 'iMovies Cinema',
              showDate: b.showDate,
              showTime: b.showTime,
              selectedSeats: b.selectedSeats,
              totalAmount: b.totalAmount,
            });

            return (
              <div
                key={b._id}
                className="bg-[#131B2E] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-[#00A8E1] font-bold">
                      #{b.bookingId}
                    </span>
                    <h2 className="text-lg font-black text-white mt-1 line-clamp-1">
                      {b.movieTitle || 'Movie Title'}
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{b.theatreName}</span>
                    </p>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmed</span>
                      </span>
                    ) : isRefunded ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <span>Refunded</span>
                      </span>
                    ) : isCancelled ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3 h-3" />
                        <span>Cancelled</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#0A0E17] rounded-xl p-3 border border-slate-800 text-xs grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Date & Time</div>
                    <div className="text-slate-200 font-semibold mt-0.5">
                      📅 {b.showDate} • ⏰ {b.showTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Seats</div>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      🎟️ {b.selectedSeats?.join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Total Paid</div>
                    <div className="text-white font-extrabold mt-0.5">
                      ₹{b.totalAmount}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Payment ID</div>
                    <div className="text-slate-400 font-mono text-[11px] truncate mt-0.5">
                      {b.paymentId || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  {isCompleted && (
                    <button
                      onClick={() => setActiveTicket(b)}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#00A8E1]" />
                      <span>View Pass</span>
                    </button>
                  )}

                  {isCompleted && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Share to WhatsApp</span>
                    </a>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => handleCancelBooking(b.bookingId)}
                      disabled={cancellingId === b.bookingId}
                      className="py-2 px-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl text-xs font-semibold border border-rose-500/20 transition-colors"
                      title="Cancel Reservation"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Digital Ticket Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#131B2E] border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0">
            {/* Prime Graphic Banner */}
            <div className="bg-gradient-to-r from-[#00A8E1] via-sky-600 to-[#00509D] p-6 text-white text-center relative shadow-md">
              <span className="text-[10px] font-black tracking-widest uppercase opacity-85">
                Official Prime Admission Pass
              </span>
              <h2 className="text-2xl font-black mt-1">{activeTicket.movieTitle}</h2>
              <p className="text-xs text-sky-100 mt-1">📍 {activeTicket.theatreName}</p>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#0A0E17] p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Date</span>
                  <p className="text-white font-bold text-sm mt-0.5">📅 {activeTicket.showDate}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Showtime</span>
                  <p className="text-white font-bold text-sm mt-0.5">⏰ {activeTicket.showTime}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Seats</span>
                  <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
                    🎟️ {activeTicket.selectedSeats?.join(', ')}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Booking ID</span>
                  <p className="text-[#00A8E1] font-mono font-bold mt-0.5">
                    #{activeTicket.bookingId}
                  </p>
                </div>
              </div>

              {/* Barcode Visual */}
              <div className="text-center py-4 border-t border-b border-dashed border-slate-700 my-4">
                <div className="font-mono text-xl tracking-[10px] text-slate-400 font-black">
                  ||||| | |||| ||||| || ||||
                </div>
                <div className="text-[10px] text-slate-500 tracking-widest font-mono mt-1">
                  PASS-TOKEN: {activeTicket.orderId || activeTicket.paymentId || activeTicket.bookingId}
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={generateWhatsAppShareLink({
                    bookingId: activeTicket.bookingId,
                    movieTitle: activeTicket.movieTitle,
                    theatreName: activeTicket.theatreName,
                    showDate: activeTicket.showDate,
                    showTime: activeTicket.showTime,
                    selectedSeats: activeTicket.selectedSeats,
                    totalAmount: activeTicket.totalAmount,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share to WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={printTicket}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-2 border border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="py-3 px-4 bg-[#0A0E17] hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
