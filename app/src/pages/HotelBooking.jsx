import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultPets } from '../data/products';
import { useMascotStore } from '../stores/useMascotStore';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const hotelSuites = [
  {
    id: 's1',
    name: 'Standard Sanctuary',
    category: 'Essential Comfort',
    description: 'A cozy, climate-controlled retreat providing high-quality nutrition and essential care for a comfortable stay.',
    price: 45,
    image: '/hotel-standard-room.webp',
    color: 'bg-sage-dark',
    features: ['High-Quality Food', 'Cozy Living Space', 'Classic Toy Set', 'Daily Exercise']
  },
  {
    id: 's2',
    name: 'Premium Oasis',
    category: 'Elite Experience',
    description: 'The ultimate luxury stay including all Standard features plus comprehensive spa packages and specialized 24/7 care.',
    price: 125,
    image: '/hotel-luxury-room.webp',
    color: 'bg-forest',
    features: ['ALL STANDARD FEATURES +', 'Full Spa & Grooming', 'Gourmet Dining Menu', 'Private Area', 'Live 4K Stream']
  }
];

export default function HotelBooking({ onBook }) {
  const today = new Date();
  const [selectedPet, setSelectedPet] = useState(defaultPets[0]);
  const [selectedSuite, setSelectedSuite] = useState(hotelSuites[0].id);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear] = useState(today.getFullYear());
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const resetForm = () => {
    setSelectedPet(defaultPets[0]);
    setSelectedSuite(hotelSuites[0].id);
    setCheckIn(null);
    setCheckOut(null);
    setCurrentMonth(today.getMonth());
    setBookingConfirmed(false);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };
  
  const setWagging = useMascotStore((state) => state.setWagging);
  const triggerJump = useMascotStore((state) => state.triggerJump);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, current: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true });
    return days;
  }, [firstDay, daysInMonth, prevMonthDays]);

  const handleDateClick = (day) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (day > checkIn) {
        setCheckOut(day);
      } else {
        setCheckIn(day);
      }
    }
  };

  const duration = checkOut ? checkOut - checkIn : 0;
  const suiteDetails = hotelSuites.find(s => s.id === selectedSuite);
  const subtotal = suiteDetails.price * Math.max(1, duration);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleConfirm = async () => {
    if (!checkIn || !checkOut || !profile || !selectedPet) return;
    
    setIsSubmitting(true);
    try {
      // Construct ISO string for Supabase
      const checkInDate = new Date(currentYear, currentMonth, checkIn).toISOString();
      const checkOutDate = new Date(currentYear, currentMonth, checkOut).toISOString();

      // Use fixed UUID-like strings for Buddy and Mochi
      const petIdMap = { 
        'Buddy': '00000000-0000-0000-0000-000000000001', 
        'Mochi': '00000000-0000-0000-0000-000000000002' 
      };
      const hardcodedPetId = petIdMap[selectedPet.name] || selectedPet.id;
 
      const { error } = await supabase
        .from('hotel_bookings')
        .insert({
          user_id: profile.id,
          pet_id: hardcodedPetId,
          suite_type: suiteDetails.name,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          duration_nights: duration,
          price_per_night: suiteDetails.price,
          subtotal: subtotal,
          tax_amount: tax,
          total_amount: total,
          status: 'confirmed',
          note: `Stay for ${selectedPet.name}`
        });

      if (error) throw error;

      setBookingConfirmed(true);
      setShowModal(true);
      triggerJump();
    } catch (err) {
      console.error('Hotel booking error:', err.message);
      alert('Failed to confirm reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/30">
      {/* Floating Decor */}
      <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-sage-dark opacity-10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-earth-rose opacity-10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative pt-32 pb-20 px-6 max-w-screen-2xl mx-auto">
        {/* Header Hero */}
        <header className="relative mb-12 sm:mb-20 rounded-2xl sm:rounded-3xl overflow-hidden h-[320px] sm:h-[450px] md:h-[500px] antigravity-shadow">
          <img 
            src="/hotel-background-3.png" 
            alt="Luxury Pet Hotel" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/40 to-transparent" />
          
          <motion.div 
            initial={{ x: -50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 sm:px-16 max-w-2xl z-20"
          >
            <div className="glass-panel-strong p-6 sm:p-12 rounded-2xl max-w-[90%] sm:max-w-none">
              <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4">
                <span className="material-symbols-outlined text-sage-dark text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>king_bed</span>
                <span className="text-[10px] sm:text-sm tracking-[0.2em] uppercase font-semibold text-sage-dark">{t('hotel.tagline')}</span>
              </div>
              <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-forest tracking-tight mb-4 sm:mb-6 leading-tight sm:leading-[1.1]">{t('hotel.heroTitle')}</h1>
              <p className="text-xs sm:text-lg text-surface-variant leading-relaxed font-medium">
                A home away from home for your beloved companions, where luxury meets unparalleled care.
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          {/* Left Column (Forms) */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            
            {/* Step 1: Select Pet */}
            <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold shadow-lg shadow-sage-dark/20 text-sm sm:text-base">1</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-charcoal">{t('hotel.selectPet')}</h2>
              </div>
              <div className="glass-panel p-6 sm:p-10 rounded-2xl antigravity-shadow flex flex-wrap gap-4 sm:gap-8">
                {defaultPets.map(pet => {
                  const isSelected = selectedPet?.id === pet.id;
                  return (
                    <motion.div
                      key={pet.id}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPet(pet)}
                      className={`flex flex-col items-center p-4 sm:p-5 rounded-2xl cursor-pointer transition-all shadow-xl min-w-[120px] flex-1 sm:flex-none ${
                        isSelected
                          ? 'bg-white/40 border-2 border-sage-dark scale-105'
                          : 'bg-white/20 border-2 border-transparent hover:bg-white/40'
                      }`}
                    >
                      <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 ${isSelected ? 'ring-4 ring-sage-dark/30 shadow-2xl' : ''}`}>
                        <img alt={pet.name} className="w-full h-full object-cover" src={pet.image} />
                      </div>
                      <span className="font-black text-forest text-base sm:text-lg">{pet.name}</span>
                      <span className="text-[10px] sm:text-xs text-charcoal/60 font-bold uppercase tracking-widest">{pet.breed}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Step 2: Duration */}
            <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold shadow-lg shadow-sage-dark/20 text-sm sm:text-base">2</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-charcoal">{t('hotel.stayDuration')}</h2>
              </div>
              <div className="glass-panel p-5 sm:p-8 rounded-2xl antigravity-shadow">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h3>
                    <p className="text-xs text-surface-variant font-medium">{t('hotel.selectCheckInOut')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => setCurrentMonth(m => Math.max(0, m - 1))} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={() => setCurrentMonth(m => Math.min(11, m + 1))} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-4 text-[10px] sm:text-xs font-bold text-surface-variant uppercase tracking-widest pb-2 border-b border-white/20">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d}>{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
                  {calendarDays.map((d, i) => {
                    const isSelected = d.current && (d.day === checkIn || d.day === checkOut);
                    const isInRange = d.current && checkIn && checkOut && d.day > checkIn && d.day < checkOut;
                    
                    const dateObj = d.current ? new Date(currentYear, currentMonth, d.day) : null;
                    const isPast = d.current && dateObj < new Date().setHours(0,0,0,0);
                    
                    return (
                      <div
                        key={i}
                        onClick={() => d.current && !isPast && handleDateClick(d.day)}
                        className={`aspect-square flex items-center justify-center transition-all rounded-xl relative cursor-pointer text-sm sm:text-base ${
                          !d.current ? 'text-charcoal/20' :
                          isPast ? 'text-charcoal/30 cursor-not-allowed' :
                          isSelected ? 'bg-sage-dark text-white font-bold shadow-lg z-10' :
                          isInRange ? 'bg-sage/20 text-sage-dark font-bold' :
                          'text-charcoal hover:bg-white/40'
                        }`}
                      >
                        {d.day}
                        {isSelected && (
                          <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white/30 p-4 rounded-2xl border border-white/40 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-sage-dark">
                      <span className="material-symbols-outlined text-xl">login</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-surface-variant leading-tight">{t('hotel.checkIn')}</p>
                      <p className="font-black text-forest">{checkIn ? `${monthNames[currentMonth].slice(0,3)} ${checkIn}` : '--'}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-white/30 p-4 rounded-2xl border border-white/40 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-earth-rose/20 flex items-center justify-center text-earth-rose">
                      <span className="material-symbols-outlined text-xl">logout</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-surface-variant leading-tight">{t('hotel.checkOut')}</p>
                      <p className="font-black text-forest">{checkOut ? `${monthNames[currentMonth].slice(0,3)} ${checkOut}` : '--'}</p>
                    </div>
                  </div>
                  <div className="sm:w-32 bg-sage-dark p-4 rounded-2xl flex flex-col items-center justify-center text-white">
                    <p className="text-[10px] uppercase font-bold opacity-70 leading-tight">Total</p>
                    <p className="text-2xl font-black">{duration || '--'}</p>
                    <p className="text-[8px] uppercase font-black">{t('common.nights')}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Step 3: Choose Suite */}
            <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold shadow-lg shadow-sage-dark/20 text-sm sm:text-base">3</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-charcoal">{t('hotel.chooseSuite')}</h2>
              </div>
              <div className="flex flex-col gap-6 sm:gap-8">
                {hotelSuites.map((suite, i) => {
                  const isSelected = selectedSuite === suite.id;
                  return (
                    <motion.div
                      key={suite.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedSuite(suite.id)}
                      onMouseEnter={() => setWagging(true)}
                      onMouseLeave={() => setWagging(false)}
                      className={`glass-panel rounded-3xl cursor-pointer group transition-all duration-500 relative flex flex-col sm:flex-row overflow-hidden shadow-xl hover:shadow-2xl ${
                        isSelected 
                          ? 'border-2! border-sage-dark! ring-4 ring-sage-dark/10 scale-[1.01]' 
                          : 'border border-white/40 grayscale-[0.3] hover:grayscale-0'
                      }`}
                    >
                      {/* Image Side */}
                      <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                        <img 
                          src={suite.image} 
                          alt={suite.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${suite.color}`}>
                          {suite.category}
                        </div>
                      </div>
                      
                      {/* Info Side */}
                      <div className="flex-1 p-6 sm:p-8 flex flex-col">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 sm:mb-6">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-forest mb-2">{suite.name}</h3>
                            <p className="text-xs sm:text-sm text-surface-variant leading-relaxed max-w-md">{suite.description}</p>
                          </div>
                          <div className="text-left sm:text-right">
                             <span className="block text-xl sm:text-3xl font-black text-sage-dark leading-none">${suite.price}</span>
                             <span className="text-[10px] uppercase font-bold text-outline">per night</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-auto">
                          {suite.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-charcoal/70">
                              <span className="material-symbols-outlined text-[16px] text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          layoutId="suite-check" 
                          className="absolute top-4 left-4 sm:left-auto sm:right-[60.5%] bg-sage-dark text-white rounded-full p-2 shadow-xl z-30 flex items-center justify-center border-2 border-white"
                        >
                          <span className="material-symbols-outlined text-sm sm:text-base font-black">check</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          </div>

          {/* Right Column (Summary) */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <motion.div 
               initial={{ y: 40, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="glass-panel p-6 sm:p-10 rounded-2xl antigravity-shadow sticky top-24"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-charcoal mb-6 sm:mb-8">{t('hotel.bookingSummary')}</h3>
              
              <div className="bg-white/40 p-5 sm:p-6 rounded-xl mb-8 sm:mb-10 space-y-2 border border-white/40 shadow-inner">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/40">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-sage">
                    <img src={selectedPet?.image || '/placeholder-pet.png'} alt={selectedPet?.name || 'Pet'} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-surface-variant font-bold">{t('hotel.reservingFor')}</span>
                    <span className="font-black text-sm sm:text-base">{selectedPet?.name || '...'}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                   <div className="flex justify-between items-center text-charcoal">
                    <span className="font-bold">{suiteDetails.name}</span>
                    <span className="font-medium">${suiteDetails.price.toFixed(2)}/night</span>
                  </div>
                  <div className="flex justify-between items-center text-surface-variant border-b border-white/40 pb-3">
                    <span>{t('hotel.duration')}</span>
                    <span className="font-bold text-charcoal">{duration} nights</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-surface-variant">{t('common.subtotal')}</span>
                    <span className="font-bold text-charcoal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-variant">Tax & Fees (5%)</span>
                    <span className="font-bold text-charcoal">${tax.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t-2 border-forest/10 mb-8 sm:mb-10">
                <span className="text-lg sm:text-xl text-forest font-bold">{t('hotel.totalStayCost')}</span>
                <span className="text-2xl sm:text-4xl text-sage-dark font-black tracking-tighter">${total.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6 text-xs font-bold text-sage-dark bg-sage/20 py-2 rounded-full">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Free cancellation until May 12
              </div>

              <motion.button
                whileHover={(!isSubmitting && !bookingConfirmed && checkIn && checkOut) ? { scale: 1.02 } : {}}
                whileTap={(!isSubmitting && !bookingConfirmed && checkIn && checkOut) ? { scale: 0.98 } : {}}
                onClick={handleConfirm}
                disabled={isSubmitting || bookingConfirmed || !checkIn || !checkOut}
                className={`group w-full py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all duration-300 relative overflow-hidden ${
                  (!isSubmitting && !bookingConfirmed && checkIn && checkOut)
                    ? 'bg-forest text-white shadow-xl shadow-forest/30 hover:shadow-2xl hover:shadow-forest/50'
                    : 'bg-outline-variant/30 text-outline cursor-not-allowed shadow-none'
                }`}
              >
                {/* Hover Gradient Overlay */}
                {(!isSubmitting && !bookingConfirmed && checkIn && checkOut) && (
                  <div className="absolute inset-0 bg-linear-to-r from-forest via-sage-dark to-forest opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                <div className="relative z-10 flex items-center justify-center gap-3 w-full">
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : bookingConfirmed ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>Sanctuary Confirmed!</span>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl sm:text-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-0.5 group-hover:text-sage-light" style={{ fontVariationSettings: "'FILL' 1" }}>hotel_class</span>
                      <span className="transition-all duration-300 group-hover:tracking-wide">{t('hotel.confirmBooking')}</span>
                      <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-110 group-hover:text-sage-light">arrow_forward</span>
                    </>
                  )}
                </div>
              </motion.button>

              <div className="mt-6 flex justify-center items-center gap-2 text-[10px] sm:text-xs text-surface-variant/70 font-bold uppercase tracking-widest">
                <span className="material-symbols-outlined text-[14px]">local_hospital</span>
                Safe Stay Certified • Vet on-call 24/7
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.18)' }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl p-5 sm:p-10 max-h-[90vh] overflow-y-auto overflow-x-hidden w-full max-w-md text-center shadow-2xl antigravity-shadow relative"
              style={{ backgroundColor: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.7)' }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-charcoal/60 text-lg">close</span>
              </button>
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-24 h-24 rounded-full bg-sage-dark/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-sage-dark/20"
              >
                <span
                  className="material-symbols-outlined text-sage-dark"
                  style={{ fontSize: 52, fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="w-full">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-sage-dark mb-2 px-2">Reservation Confirmed</p>
                <h2 className="text-2xl sm:text-3xl font-black text-forest mb-3">Sanctuary Booked!</h2>
                <p className="text-surface-variant text-sm leading-relaxed mb-2 px-1">
                  <span className="font-bold text-charcoal">{selectedPet?.name}</span> is all set at the
                  <span className="font-bold text-charcoal"> {suiteDetails?.name}</span>.
                </p>
                <p className="text-surface-variant text-sm mb-8">
                  {checkIn && checkOut
                    ? `${monthNames[currentMonth].slice(0, 3)} ${checkIn} → ${monthNames[currentMonth].slice(0, 3)} ${checkOut} · ${duration} nights`
                    : ''}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-sage-dark bg-sage/20 py-2.5 px-3 rounded-2xl sm:rounded-full mb-6 mx-auto">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  Safe Stay Certified • Vet on-call 24/7
                </div>

                <button
                  onClick={() => { closeModal(); navigate('/hotel-bookings'); }}
                  className="w-full py-3 sm:py-3.5 rounded-full bg-forest text-white font-bold text-sm sm:text-base shadow-xl shadow-forest/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                  View My Bookings
                </button>


              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
