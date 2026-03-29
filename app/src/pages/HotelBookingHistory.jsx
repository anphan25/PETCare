// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../supabaseClient';
import PageLoader from '../components/PageLoader';
import { useMinimumLoading } from '../hooks/useMinimumLoading';


export default function HotelBookingHistory() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const showLoader = useMinimumLoading(isLoading, 1500);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    if (!user) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('hotel_bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('check_in_date', { ascending: false });

        if (error) throw error;
        
        const formattedBookings = (data || []).map(booking => {
          const checkIn = new Date(booking.check_in_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          const checkOut = new Date(booking.check_out_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          const isLuxury = booking.suite_type?.toLowerCase().includes('premium') || booking.suite_type?.toLowerCase().includes('oasis');
          const roomImage = isLuxury ? '/hotel-luxury-room.webp' : '/hotel-standard-room.webp';
          const petNameMatch = booking.note?.match(/Stay for ([^(]+)/);
          const petNameFromNote = petNameMatch ? petNameMatch[1].trim() : 'My Pet';

          return {
            id: `HTL-${booking.id.slice(0, 4).toUpperCase()}`,
            dbId: booking.id,
            checkIn,
            checkOut,
            date: `${checkIn} – ${checkOut}`,
            total: Number(booking.total_amount) || 0,
            subtotal: Number(booking.subtotal) || 0,
            tax: Number(booking.tax_amount) || 0,
            pricePerNight: Number(booking.price_per_night) || 0,
            duration: Number(booking.duration_nights) || 0,
            status: booking.status || 'Reserved',
            statusColor: 'bg-forest',
            petName: petNameFromNote,
            package: booking.suite_type,
            image: roomImage,
          };
        });

        setUserBookings(formattedBookings);
      } catch (err) {
        console.error('Error loading hotel bookings:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
    return () => setIsLoading(false);
  }, [user]);

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/30">

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 right-10 w-[400px] h-[400px] bg-sage/10 rounded-full blur-3xl opacity-50"
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <header className="mb-16">
          <Link to="/" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sage-dark mb-8 hover:bg-white/40 transition-all hover:-translate-x-1">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl sm:text-6xl font-black text-forest tracking-tighter mb-4">Hotel Bookings</h1>
            <p className="text-lg text-surface-variant max-w-xl leading-relaxed">
              Review your upcoming stays and past sanctuary hotel reservations.
            </p>
          </motion.div>
        </header>

        <div className="space-y-6">
          {showLoader ? (
            <PageLoader label="Loading your reservations" />
          ) : userBookings.length > 0 ? (
            userBookings.map((booking, index) => (
              <motion.div
                key={booking.dbId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedBooking(booking)}
                className="glass-panel p-6 sm:p-8 rounded-2xl antigravity-shadow relative overflow-hidden group border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-sage/10 transition-colors" />

                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 bg-white/30 shrink-0 group-hover:scale-105 transition-transform duration-700">
                    <img src={booking.image} alt={booking.package} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-black text-white px-2 py-0.5 bg-forest rounded-md shadow-sm uppercase tracking-tighter">{booking.id}</span>
                      <span className="text-[10px] uppercase font-bold text-surface-variant/80 tracking-widest bg-white/40 px-3 py-0.5 rounded-full border border-white/60 truncate max-w-[200px]">{booking.date}</span>
                    </div>
                    <h3 className="font-black text-forest text-base mb-1">{booking.package}</h3>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-sage-dark">pets</span>
                      <span className="text-sm text-charcoal/80 font-bold">
                        Stay for <span className="text-sage-dark">{booking.petName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 relative z-10 border-t md:border-t-0 md:border-l border-white/40 pt-6 md:pt-0 md:pl-10 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-surface-variant uppercase tracking-widest block mb-0.5">Total Amount</span>
                    <span className="text-2xl font-black text-forest">${booking.total.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-4 py-2 rounded-full text-xs font-bold text-white ${booking.statusColor} shadow-md whitespace-nowrap`}>
                      {booking.status}
                    </div>
                    <span className="text-[10px] font-bold text-sage-dark flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[13px]">info</span>
                      View details
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-16 rounded-3xl text-center border border-white/40">
              <span className="material-symbols-outlined text-6xl text-sage-dark/30 mb-6 block">hotel</span>
              <h3 className="text-2xl font-bold text-forest mb-2">No Reservations Yet</h3>
              <p className="text-surface-variant mb-8">Book a luxurious sanctuary suite for your beloved pet.</p>
              <Link to="/hotel" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
                Book Suite
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0"
              style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.2)' }}
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative z-10 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.7)' }}
            >
              {/* Hero image */}
              <div className="relative h-52 overflow-hidden">
                <img src={selectedBooking.image} alt={selectedBooking.package} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

                {/* Close btn */}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-white text-lg">close</span>
                </button>

                {/* Status pill */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-black text-white ${selectedBooking.statusColor} shadow-lg backdrop-blur-sm uppercase tracking-wide`}>
                    {selectedBooking.status}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-[11px] font-black text-white bg-black/30 backdrop-blur-sm uppercase tracking-wide">
                    {selectedBooking.id}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                {/* Title */}
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-sage-dark mb-1">Hotel Reservation</p>
                  <h2 className="text-2xl font-black text-forest tracking-tight">{selectedBooking.package}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[16px] text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
                    <span className="text-sm font-bold text-charcoal/70">Stay for <span className="text-sage-dark">{selectedBooking.petName}</span></span>
                  </div>
                </div>

                {/* Date grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/60 rounded-2xl p-4 border border-white/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-sm text-sage-dark">login</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-surface-variant">Check-In</span>
                    </div>
                    <p className="font-black text-forest text-sm leading-tight">{selectedBooking.checkIn}</p>
                  </div>
                  <div className="bg-white/60 rounded-2xl p-4 border border-white/60">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-sm text-earth-rose">logout</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-surface-variant">Check-Out</span>
                    </div>
                    <p className="font-black text-forest text-sm leading-tight">{selectedBooking.checkOut}</p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="bg-forest/5 rounded-2xl p-5 border border-forest/8 mb-6 space-y-2.5">
                  <h3 className="text-xs font-black text-forest uppercase tracking-widest border-b border-forest/10 pb-2.5 mb-3">Price Breakdown</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-variant">Suite rate</span>
                    <span className="font-bold text-charcoal">${selectedBooking.pricePerNight.toFixed(2)} / night</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-variant">Duration</span>
                    <span className="font-bold text-charcoal">{selectedBooking.duration} night{selectedBooking.duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-variant">Subtotal</span>
                    <span className="font-bold text-charcoal">${selectedBooking.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-variant">Tax & Fees (5%)</span>
                    <span className="font-bold text-charcoal">${selectedBooking.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-forest/10">
                    <span className="text-base font-black text-forest">Total Paid</span>
                    <span className="text-2xl font-black text-sage-dark tracking-tight">${selectedBooking.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-sage-dark bg-sage/15 py-2.5 rounded-full">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  Safe Stay Certified • Vet on-call 24/7
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
