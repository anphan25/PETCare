// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../supabaseClient';


export default function HotelBookingHistory() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    // Start loading immediately when entering the page
    setIsLoading(true);

    if (!user) {
      // If no user session is found after a brief check, hide loading
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
          const checkIn = new Date(booking.check_in_date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          });
          const checkOut = new Date(booking.check_out_date).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          });

          const isLuxury = booking.suite_type?.toLowerCase().includes('premium') || booking.suite_type?.toLowerCase().includes('oasis');
          const roomImage = isLuxury ? '/hotel-luxury-room.webp' : '/hotel-standard-room.webp';

          // Extract pet name from note if it exists (format: "Stay for PetName")
          const petNameMatch = booking.note?.match(/Stay for ([^(]+)/);
          const petNameFromNote = petNameMatch ? petNameMatch[1].trim() : 'My Pet';

          return {
            id: `HTL-${booking.id.slice(0, 4).toUpperCase()}`,
            dbId: booking.id,
            date: `${checkIn} - ${checkOut}`,
            total: Number(booking.total_amount) || 0,
            status: booking.status || 'Reserved',
            statusColor: 'bg-forest',
            icon: 'hotel',
            itemCount: 1,
            petName: petNameFromNote,
            package: booking.suite_type,
            items: [{
              name: `${booking.suite_type} Suite`,
              price: Number(booking.total_amount) || 0,
              qty: 1,
              image: roomImage
            }]
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
    
    // Cleanup to ensure loading is off when leaving the page
    return () => setIsLoading(false);
  }, [user]);

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/30">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
          <div className="w-12 h-12 border-4 border-sage/30 border-t-sage-dark rounded-full animate-spin"></div>
        </div>
      )}
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
                
                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-4xl overflow-hidden shadow-2xl border-2 border-white/60 bg-white/30 shrink-0 group-hover:scale-105 transition-transform duration-700">
                    <img 
                      src={booking.items[0].image} 
                      alt={booking.package} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-black text-white px-2 py-0.5 bg-forest rounded-md shadow-sm uppercase tracking-tighter">{booking.id}</span>
                      <span className="text-[10px] uppercase font-bold text-surface-variant/80 tracking-widest bg-white/40 px-3 py-0.5 rounded-full border border-white/60">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-sage-dark font-black">pets</span>
                      <span className="text-sm text-charcoal/80 font-bold">
                        Stay for <span className="text-sage-dark">{booking.petName}</span>
                      </span>
                    </div>
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
    </div>
  );
}
