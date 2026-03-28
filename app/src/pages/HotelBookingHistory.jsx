// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useBookings } from '../hooks/useStore';


export default function HotelBookingHistory() {
  const { user, setLoading } = useAuthStore();
  const { bookings } = useBookings();
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    // Start loading immediately when entering the page
    setLoading(true);

    if (!user) {
      // If no user session is found after a brief check, hide loading
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }

    const fetchBookings = () => {
      try {
        const hotelBookings = bookings.filter(b => b.type === 'hotel');
        
        const formattedBookings = hotelBookings.map(booking => {
          const date = new Date(booking.checkIn || booking.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          });

          return {
            id: `HTL-${booking.id.slice(0, 4).toUpperCase()}`,
            dbId: booking.id,
            date: date,
            total: booking.price || 0,
            status: 'Reserved',
            statusColor: 'bg-forest',
            icon: 'hotel',
            itemCount: 1,
            petName: booking.petName,
            package: booking.roomType,
            items: [{
              name: `${booking.roomType} Suite for ${booking.petName}`,
              price: booking.price || 0,
              qty: 1,
              image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80'
            }]
          };
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        setUserBookings(formattedBookings);
      } catch (err) {
        console.error('Error loading hotel bookings:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    
    // Cleanup to ensure loading is off when leaving the page
    return () => setLoading(false);
  }, [user, setLoading, bookings]);

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 w-[400px] h-[400px] bg-sage/10 rounded-full blur-3xl opacity-50" 
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <header className="mb-16">
          <Link to="/" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sage-dark mb-8 hover:bg-white/40 transition-all hover:-translate-x-1">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black text-forest tracking-tighter mb-4">Hotel Bookings</h1>
            <p className="text-lg text-surface-variant max-w-xl leading-relaxed">
              Review your upcoming stays and past sanctuary hotel reservations.
            </p>
          </motion.div>
        </header>

        <div className="space-y-6">
          {userBookings.length > 0 ? (
            userBookings.map((booking, index) => (
              <motion.div
                key={booking.dbId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 sm:p-8 rounded-2xl antigravity-shadow relative overflow-hidden group border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-sage/10 transition-colors" />
                
                <div className="flex items-center gap-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${booking.statusColor} text-white flex items-center justify-center shadow-lg shadow-black/5`}>
                    <span className="material-symbols-outlined text-3xl">{booking.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-black text-forest">{booking.id}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-surface-variant py-1 px-2 bg-white/40 rounded-full border border-white/60">{booking.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-charcoal mb-0.5 max-w-md truncate">
                      {booking.items.map(item => item.name).join(', ')}
                    </h3>
                    <p className="text-xs text-surface-variant font-medium">
                      {booking.petName} • Suite • 
                      <span 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-sage-dark hover:underline cursor-pointer ml-1 font-bold"
                      >
                        View Details
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 relative z-10 border-t md:border-t-0 md:border-l border-white/40 pt-6 md:pt-0 md:pl-10">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-surface-variant uppercase tracking-widest block mb-0.5">Total Amount</span>
                    <span className="text-2xl font-black text-forest">${booking.total.toFixed(2)}</span>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-xs font-bold text-white ${booking.statusColor} shadow-md shadow-black/5 whitespace-nowrap`}>
                    {booking.status}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="glass-panel p-16 rounded-3xl text-center border border-white/40"
            >
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

      {/* Order Summary Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-forest/20 backdrop-blur-xl" 
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="glass-panel-strong p-8 sm:p-12 rounded-[40px] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-[120px]">{selectedBooking.icon}</span>
              </div>

              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-sage-dark uppercase tracking-[0.2em]">Sanctuary Reservation</span>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${selectedBooking.statusColor}`}>
                      {selectedBooking.status}
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-forest tracking-tight">{selectedBooking.id}</h2>
                  <p className="text-surface-variant font-medium">{selectedBooking.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sage-dark hover:bg-white/40 transition-all font-black"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6 mb-10 overflow-y-auto max-h-[30vh] pr-2 scrollbar-hide">
                <h3 className="text-sm font-black text-forest uppercase tracking-widest border-b border-forest/10 pb-2">Suite Detail</h3>
                <div className="space-y-4">
                  {selectedBooking.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/30 p-4 rounded-2xl border border-white/40 group/item hover:bg-white/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover/item:scale-110 transition-transform duration-500" 
                          alt={item.name} 
                        />
                        <div>
                          <p className="font-bold text-charcoal">{item.name}</p>
                          <p className="text-xs text-surface-variant font-medium">Quantity: {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-black text-forest">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-forest/5 p-6 rounded-[30px] border border-forest/10">
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xl font-black text-forest">Amount Paid</span>
                  <span className="text-3xl font-black text-sage-dark tracking-tighter">${selectedBooking.total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-full mt-10 py-4 btn-primary rounded-2xl font-bold flex items-center justify-center gap-2 group overflow-hidden relative shadow-lg"
              >
                <span className="material-symbols-outlined text-white transition-transform group-hover:rotate-12">key</span>
                Book Another Stay
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
