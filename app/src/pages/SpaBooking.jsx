import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { spaServices, defaultPets, timeSlots, groomer } from '../data/products';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function SpaBooking({ onBook }) {
  const [selectedPet, setSelectedPet] = useState(defaultPets[0]);
  const [selectedServices, setSelectedServices] = useState([spaServices[1].id]);
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear] = useState(2026);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const bookedDates = [3, 7, 12, 21];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, current: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true });
    return days;
  }, [firstDay, daysInMonth, prevMonthDays]);

  const toggleService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectedServiceDetails = spaServices.filter(s => selectedServices.includes(s.id));
  const subtotal = selectedServiceDetails.reduce((sum, s) => sum + s.price, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleConfirm = () => {
    const booking = {
      pet: selectedPet.name,
      services: selectedServiceDetails.map(s => s.name),
      date: `${monthNames[currentMonth]} ${selectedDate}, ${currentYear}`,
      time: selectedTime,
      total,
    };
    onBook(booking);
    setBookingConfirmed(true);
    setTimeout(() => setBookingConfirmed(false), 3000);
  };

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal">
      {/* Floating Mesh Background Decor - Enhanced for contrast */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sage opacity-40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-earth-rose-light opacity-30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-sage-light opacity-20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-sage-dark opacity-30 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative pt-32 pb-20 px-6 max-w-screen-2xl mx-auto overflow-hidden">
        {/* Page Header */}
        <header className="relative mb-20 text-center md:text-left z-10">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="inline-flex items-center space-x-2 mb-4">
              <span className="material-symbols-outlined text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              <span className="text-sm tracking-[0.2em] uppercase font-semibold text-sage-dark">The Ethereal Sanctuary</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-forest tracking-tight mb-6">Luxury Spa & Grooming</h1>
            <p className="text-xl text-surface-variant max-w-2xl leading-relaxed">
              Give your pet the royal treatment they deserve. From organic chamomile baths to precision styling, book a pampering session today.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          {/* Left Column (60%) */}
          <div className="lg:col-span-7 space-y-16">
            {/* Step 1: Select Your Pet */}
            <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold shadow-lg shadow-sage-dark/20 bg-primary">1</span>
                <h2 className="text-2xl font-semibold text-charcoal">Select Your Pet</h2>
              </div>
              <div className="glass-panel p-8 rounded-2xl antigravity-shadow flex flex-wrap gap-6">
                {defaultPets.map(pet => {
                  const isSelected = selectedPet.id === pet.id;
                  return (
                    <motion.div
                      key={pet.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPet(pet)}
                      className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all shadow-lg ${
                        isSelected
                          ? 'bg-white/40 border-2 border-sage-dark'
                          : 'bg-white/20 border-2 border-transparent hover:bg-white/40'
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-full overflow-hidden mb-3 ${isSelected ? 'ring-4 ring-sage-dark/20' : ''}`}>
                        <img alt={pet.name} className="w-full h-full object-cover" src={pet.image} />
                      </div>
                      <span className="font-bold text-charcoal">{pet.name}</span>
                      <span className="text-xs text-surface-variant">{pet.age} • {pet.breed}</span>
                    </motion.div>
                  );
                })}
                <button className="flex flex-col items-center justify-center p-4 w-32 h-36 rounded-xl border-2 border-dashed border-outline-variant hover:border-sage-dark hover:bg-white/30 hover:text-sage-dark transition-all group">
                  <span className="material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                  <span className="text-sm font-medium">Add Pet</span>
                </button>
              </div>
            </motion.section>

            {/* Step 2: Choose Services */}
            <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold shadow-lg shadow-sage-dark/20 bg-primary">2</span>
                <h2 className="text-2xl font-semibold text-charcoal">Choose Services</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {spaServices.map((service, i) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4 }}
                      onClick={() => toggleService(service.id)}
                      className={`glass-panel p-6 rounded-2xl cursor-pointer group transition-all ${
                        isSelected
                          ? 'border-2 border-sage-dark bg-white/50 shadow-[0_20px_40px_rgba(157,192,139,0.25)]'
                          : 'border border-white/40 hover:border-sage shadow-sm hover:shadow-xl'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sage-dark ${isSelected ? 'bg-sage/50' : 'bg-sage/40 group-hover:scale-110 transition-transform'}`}>
                          <span className="material-symbols-outlined" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>{service.icon}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isSelected && <span className="material-symbols-outlined text-sage-dark text-sm">check_circle</span>}
                          <span className="font-bold text-lg text-sage-dark">${service.price}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-charcoal mb-1">{service.name}</h3>
                      <p className="text-sm text-surface-variant">{service.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Step 3: Pick Date & Time */}
            <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <div className="flex items-center space-x-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold shadow-lg shadow-sage-dark/20 bg-primary">3</span>
                <h2 className="text-2xl font-semibold text-charcoal">Pick Date & Time</h2>
              </div>
              <div className="glass-panel p-8 rounded-2xl antigravity-shadow">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => setCurrentMonth(m => Math.max(0, m - 1))} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={() => setCurrentMonth(m => Math.min(11, m + 1))} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 text-center mb-4">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                    <div key={d} className="text-xs font-bold text-surface-variant uppercase tracking-widest pb-2">{d}</div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 text-center mb-10">
                  {calendarDays.map((d, i) => {
                    const isBooked = d.current && bookedDates.includes(d.day);
                    const isSelected = d.current && selectedDate === d.day;
                    return (
                      <div
                        key={i}
                        onClick={() => d.current && !isBooked && setSelectedDate(d.day)}
                        className={`aspect-square flex items-center justify-center transition-colors rounded-xl ${
                          !d.current ? 'text-outline-variant/40' :
                          isSelected ? 'bg-sage-dark text-white font-bold shadow-lg shadow-sage-dark/30 cursor-pointer' :
                          isBooked ? 'text-earth-rose font-bold cursor-not-allowed' :
                          'text-charcoal hover:bg-sage/40 cursor-pointer'
                        }`}
                      >
                        {d.day}
                      </div>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div className="space-y-4">
                  <span className="text-sm font-bold text-surface-variant uppercase tracking-widest">Available Time Slots</span>
                  <div className="flex flex-wrap gap-3">
                    {timeSlots.map(slot => {
                      const isDisabled = slot === '02:30 PM';
                      return (
                        <button
                          key={slot}
                          onClick={() => !isDisabled && setSelectedTime(slot)}
                          disabled={isDisabled}
                          className={`px-6 py-2 rounded-full transition-all text-sm font-medium ${
                            selectedTime === slot
                              ? 'bg-sage-dark text-white shadow-lg shadow-sage-dark/20'
                              : isDisabled
                              ? 'border border-white/40 bg-white/10 opacity-40 cursor-not-allowed'
                              : 'border border-white/40 bg-white/20 hover:border-sage-dark'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column (40%) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Booking Summary Card */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass-panel p-10 rounded-2xl antigravity-shadow sticky top-32"
            >
              <h3 className="text-2xl font-bold text-charcoal mb-8">Booking Summary</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-white/30">
                  <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-sage-dark">pets</span>
                    <span className="text-surface-variant">Selected Pet</span>
                  </div>
                  <span className="font-bold">{selectedPet.name}</span>
                </div>
                
                <div className="flex justify-between items-start pb-4 border-b border-white/30">
                  <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-sage-dark">spa</span>
                    <span className="text-surface-variant">Services</span>
                  </div>
                  <div className="text-right">
                    {selectedServiceDetails.length > 0 ? selectedServiceDetails.map(s => (
                      <div key={s.id}>
                        <p className="font-bold">{s.name}</p>
                        <p className="text-sm text-sage-dark font-medium">${s.price.toFixed(2)}</p>
                      </div>
                    )) : (
                      <p className="text-sm text-outline italic">No services selected</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/30">
                  <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-sage-dark">calendar_month</span>
                    <span className="text-surface-variant">Appointment</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{monthNames[currentMonth]} {selectedDate}, {currentYear}</p>
                    <p className="text-sm text-surface-variant">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 p-6 rounded-xl mb-10 space-y-2 border border-white/40 shadow-inner">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-surface-variant">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-surface-variant">Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/40">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-sage-dark">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={selectedServices.length === 0}
                className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-3 transition-all ${
                  selectedServices.length > 0
                    ? 'bg-sage-dark text-white hover:scale-[1.02] active:scale-95 shadow-xl shadow-sage-dark/30'
                    : 'bg-outline-variant/30 text-outline cursor-not-allowed'
                }`}
              >
                <span>Confirm Booking</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              {/* Groomer Card Integrated */}
              <div className="mt-12 pt-8 border-t border-white/40">
                <p className="text-xs font-bold text-surface-variant uppercase tracking-widest mb-4">Assigned Groomer</p>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/50">
                    <img alt={groomer.name} className="w-full h-full object-cover" src={groomer.image} />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal leading-tight">{groomer.name}</h4>
                    <div className="flex items-center text-xs text-surface-variant space-x-2 mt-1">
                      <span className="flex items-center text-earth-rose">
                        <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {groomer.rating}
                      </span>
                      <span>•</span>
                      <span>{groomer.experience} exp.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Booking Confirmation Toast */}
      <AnimatePresence>
        {bookingConfirmed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] glass-panel-strong px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-sage-dark text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <p className="font-bold text-forest">Booking Confirmed!</p>
              <p className="text-sm text-surface-variant">Your spa appointment has been saved.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
