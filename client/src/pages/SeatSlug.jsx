import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Ticket,
  QrCode,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const SeatSlug = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [tickets, setTickets] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // TTL Countdown Timer (in seconds)
  const [lockTimeLeft, setLockTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const socketRef = useRef(null);

  const fetchShowData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shows/${showId}`);
      if (res.data?.success) {
        setShow(res.data.show);
        setMovie(res.data.movie);
        setTheatre(res.data.theatre);
        setTickets(res.data.show.tickets || {});
      }
    } catch (err) {
      toast.error('Failed to load seat layout.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowData();

    const socket = io('/', { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_show', showId);
    });

    socket.on('seats_locked', (data) => {
      if (data.showId === showId) {
        setTickets((prev) => {
          const updated = { ...prev };
          data.seats.forEach((seatId) => {
            if (updated[seatId]) {
              updated[seatId] = {
                ...updated[seatId],
                status: 'locked',
                lockedBy: data.lockedBy,
                lockExpiresAt: data.lockExpiresAt,
              };
            }
          });
          return updated;
        });
      }
    });

    socket.on('seats_released', (data) => {
      if (data.showId === showId) {
        setTickets((prev) => {
          const updated = { ...prev };
          data.releasedSeats.forEach((seatId) => {
            if (updated[seatId]) {
              updated[seatId] = {
                ...updated[seatId],
                status: 'available',
                lockedBy: null,
                lockExpiresAt: null,
              };
            }
          });
          return updated;
        });
      }
    });

    socket.on('seats_booked', (data) => {
      if (data.showId === showId) {
        setTickets((prev) => {
          const updated = { ...prev };
          data.bookedSeats.forEach((seatId) => {
            if (updated[seatId]) {
              updated[seatId] = {
                ...updated[seatId],
                status: 'booked',
                lockedBy: null,
                lockExpiresAt: null,
              };
            }
          });
          return updated;
        });
      }
    });

    socket.on('seats_auto_released', (data) => {
      if (data.showId === showId && data.tickets) {
        setTickets(data.tickets);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_show', showId);
        socketRef.current.disconnect();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showId]);

  useEffect(() => {
    if (lockTimeLeft !== null && lockTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            toast.info('Seat reservation timer expired. Seats have been unlocked.');
            setSelectedSeats([]);
            fetchShowData();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockTimeLeft]);

  const toggleSeat = async (seatId, seatData) => {
    if (seatData.status === 'booked') {
      toast.warning('This seat has already been booked.');
      return;
    }

    if (
      seatData.status === 'locked' &&
      seatData.lockedBy &&
      seatData.lockedBy !== user?.email
    ) {
      toast.warning('This seat is temporarily on hold by another buyer.');
      return;
    }

    if (selectedSeats.includes(seatId)) {
      const newSelected = selectedSeats.filter((s) => s !== seatId);
      setSelectedSeats(newSelected);

      try {
        await api.post('/bookings/unlock-seats', {
          showId: show?.showId || showId,
          seats: [seatId],
        });
      } catch (err) {
        console.warn('Unlock API error:', err);
      }

      if (newSelected.length === 0) {
        setLockTimeLeft(null);
      }
    } else {
      if (selectedSeats.length >= 8) {
        toast.warning('You can select a maximum of 8 seats per booking.');
        return;
      }

      const newSelected = [...selectedSeats, seatId];
      setSelectedSeats(newSelected);

      try {
        const res = await api.post('/bookings/lock-seats', {
          showId: show?.showId || showId,
          seats: [seatId],
        });

        if (res.data?.success) {
          if (lockTimeLeft === null) {
            setLockTimeLeft(600);
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not lock seat. It may have just been taken.');
        setSelectedSeats(selectedSeats);
      }
    }
  };

  const seatPrices = selectedSeats.map((seatId) => {
    return tickets[seatId]?.price || 300;
  });

  const subtotal = seatPrices.reduce((a, b) => a + b, 0);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 30 : 0;
  const gst = Math.round((subtotal + convenienceFee) * 0.18);
  const grandTotal = subtotal + convenienceFee + gst;

  const formatTimer = (seconds) => {
    if (seconds == null) return '10:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat to proceed.');
      return;
    }

    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    try {
      setPaying(true);

      const orderRes = await api.post('/payment/create-order', {
        showId: show?.showId || showId,
        selectedSeats,
        totalAmount: grandTotal,
        ticketsData: tickets,
      });

      if (!orderRes.data?.success) {
        toast.error(orderRes.data?.message || 'Failed to initialize payment order.');
        setPaying(false);
        return;
      }

      const { order_id, amount, currency, bookingId, key } = orderRes.data;

      const options = {
        key: key || 'rzp_test_TpQ7mg5jyDRTt0',
        amount: amount,
        currency: currency || 'INR',
        name: 'iMovies Cinemas',
        description: `Booking for ${movie?.movieName} (${selectedSeats.join(', ')})`,
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=128&q=80',
        order_id: order_id,
        prefill: {
          name: user?.username || 'Movie Patron',
          email: user?.email || '',
          contact: user?.phone || '9999999999',
        },
        theme: {
          color: '#00A8E1',
          backdrop_color: '#0A0E17',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay using UPI / QR Code',
                instruments: [
                  { method: 'upi', apps: ['google_pay', 'phonepe', 'paytm'] },
                  { method: 'upi', flows: ['qr', 'collect'] },
                ],
              },
              other: {
                name: 'Cards & NetBanking',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });

            if (verifyRes.data?.success) {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
              });

              toast.success('🎉 Payment verified! Your tickets are booked.');
              navigate('/bookings');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (vErr) {
            toast.error(vErr.response?.data?.message || 'Error completing payment verification.');
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment checkout dismissed. Your seat lock is still active.');
            setPaying(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description || 'Transaction error'}`);
        setPaying(false);
      });

      razorpayInstance.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error initiating payment gateway.');
      setPaying(false);
    }
  };

  if (loading) {
    return <Loader message="Generating interactive cinema hall seat layout..." />;
  }

  const balconyRows = theatre?.balconySeats?.rows || ['A', 'B'];
  const middleRows = theatre?.middleSeats?.rows || ['C', 'D', 'E'];
  const lowerRows = theatre?.lowerSeats?.rows || ['F', 'G'];
  const cols = theatre?.balconySeats?.cols || 10;

  const renderSeatGrid = (rows, tierName, tierPrice, tierColorClass) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800/80 pb-1">
          <span className="uppercase tracking-wider flex items-center space-x-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${tierColorClass}`}></span>
            <span>{tierName} Tier</span>
          </span>
          <span className="text-white font-semibold">₹{tierPrice} / ticket</span>
        </div>

        <div className="space-y-2 py-1">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center space-x-2">
              <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
              <div className="flex items-center space-x-2">
                {Array.from({ length: cols }).map((_, colIdx) => {
                  const seatNumber = colIdx + 1;
                  const seatId = `${row}${seatNumber}`;
                  const seatData = tickets[seatId] || { status: 'available', price: tierPrice };

                  const isSelected = selectedSeats.includes(seatId);
                  const isBooked = seatData.status === 'booked';
                  const isLockedByOther =
                    seatData.status === 'locked' &&
                    seatData.lockedBy &&
                    seatData.lockedBy !== user?.email;

                  let seatStyle = 'bg-slate-800 border-slate-700 text-slate-300 hover:border-[#00A8E1] hover:bg-slate-700';

                  if (isBooked) {
                    seatStyle = 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-40';
                  } else if (isLockedByOther) {
                    seatStyle = 'bg-amber-950/60 border-amber-700 text-amber-500 animate-pulse cursor-not-allowed';
                  } else if (isSelected) {
                    seatStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/40 scale-110';
                  }

                  return (
                    <button
                      key={seatId}
                      disabled={isBooked || isLockedByOther}
                      onClick={() => toggleSeat(seatId, seatData)}
                      title={`Seat ${seatId} (${tierName} - ₹${tierPrice})`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-[11px] font-bold transition-all flex items-center justify-center ${seatStyle}`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
              <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <Ticket className="w-6 h-6 text-[#00A8E1]" />
            <span>{movie?.movieName}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            📍 {show?.theatreName} • 📅 {show?.showDate} • ⏰ {show?.showTime}
          </p>
        </div>

        {/* Live TTL Seat Hold Timer */}
        {selectedSeats.length > 0 && lockTimeLeft !== null && (
          <div className="flex items-center space-x-3 bg-sky-950/40 border border-[#00A8E1]/40 px-4 py-2 rounded-xl text-[#00A8E1]">
            <Clock className="w-5 h-5 animate-spin" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-sky-300">Seats Locked (TTL)</div>
              <div className="text-lg font-mono font-black">{formatTimer(lockTimeLeft)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Seat Map & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Seat Picker Canvas */}
        <div className="lg:col-span-2 bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          {/* Cinema Screen Indicator */}
          <div className="w-full max-w-md mx-auto mb-10 text-center">
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#00A8E1] to-transparent rounded-full shadow-lg shadow-[#00A8E1]/50"></div>
            <div className="h-6 w-full bg-gradient-to-b from-[#00A8E1]/20 to-transparent blur-md"></div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              CINEMA SCREEN (ALL EYES THIS WAY)
            </span>
          </div>

          {/* Seat Tiers Grid */}
          <div className="w-full space-y-8 overflow-x-auto pb-4 scrollbar-none">
            {/* Balcony */}
            {renderSeatGrid(balconyRows, 'VIP Balcony', theatre?.balconySeatPrice || 450, 'bg-purple-500')}

            {/* Middle */}
            {renderSeatGrid(middleRows, 'Prime Executive', theatre?.middleSeatPrice || 320, 'bg-[#00A8E1]')}

            {/* Lower */}
            {renderSeatGrid(lowerRows, 'Classic Lower', theatre?.lowerSeatPrice || 200, 'bg-cyan-500')}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 border border-emerald-400 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-emerald-400 font-semibold">Selected By You</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-amber-900 border border-amber-700"></div>
              <span className="text-amber-400">Temporarily Locked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800 opacity-50"></div>
              <span>Reserved / Booked</span>
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 shadow-2xl h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-[#00A8E1]" />
              <span>Booking Summary</span>
            </h3>
            <span className="text-xs bg-[#00A8E1]/20 text-[#00A8E1] px-2.5 py-0.5 rounded-full font-bold border border-[#00A8E1]/30">
              {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
            </span>
          </div>

          {/* Selected seats list */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Selected Seats
            </div>
            {selectedSeats.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No seats selected yet. Click on the map to pick.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((s) => (
                  <span
                    key={s}
                    className="bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold"
                  >
                    Seat {s} (₹{tickets[s]?.price || 300})
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-[#0A0E17] rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Ticket Subtotal:</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Convenience Fee (₹30/seat):</span>
              <span className="font-semibold">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Integrated GST (18%):</span>
              <span className="font-semibold">₹{gst}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-black text-white">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-400 text-lg">₹{grandTotal}</span>
            </div>
          </div>

          {/* Payment Gateway Features */}
          <div className="space-y-2 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2 text-[#00A8E1]">
              <QrCode className="w-4 h-4" />
              <span>Razorpay UPI Supported (Google Pay, PhonePe, Paytm, QR)</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HMAC-SHA256 Cryptographic Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Instant Nodemailer HTML ticket & WhatsApp Pass</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0 || paying}
            className={`w-full py-4 rounded-xl font-extrabold text-xs sm:text-sm text-white shadow-xl transition-all flex items-center justify-center space-x-2 ${
              selectedSeats.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-[#00A8E1] hover:bg-[#0092C5] shadow-[#00A8E1]/30 hover:scale-[1.02]'
            }`}
          >
            {paying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Opening Razorpay Gateway...</span>
              </>
            ) : (
              <>
                <span>Proceed to Pay ₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSlug;
