import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockOrders = [
  {
    id: 'ORD-8821',
    date: 'March 24, 2024',
    items: [
      { name: 'Artisan Feast (Dry)', price: 45.00, qty: 1, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=2071' },
      { name: 'Terra Bowl', price: 79.50, qty: 1, image: 'https://images.unsplash.com/photo-1576084606629-9e120f269f88?auto=format&fit=crop&q=80&w=2000' }
    ],
    itemCount: 2,
    total: 124.50,
    status: 'Delivered',
    statusColor: 'bg-sage-dark',
    icon: 'check_circle'
  },
  {
    id: 'ORD-9012',
    date: 'March 26, 2024',
    items: [
      { name: 'Linen Slumber Cloud (Rose)', price: 89.00, qty: 1, image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=2060' }
    ],
    itemCount: 1,
    total: 89.00,
    status: 'Arriving Thursday',
    statusColor: 'bg-[#5C8D89]',
    icon: 'local_shipping'
  },
  {
    id: 'ORD-9104',
    date: 'March 28, 2024',
    items: [
      { name: 'Tug & Calm Bundle', price: 32.00, qty: 1, image: 'https://images.unsplash.com/photo-1576707372155-896123985532?auto=format&fit=crop&q=80&w=1740' },
      { name: 'Bamboo Brush', price: 24.20, qty: 1, image: 'https://images.unsplash.com/photo-1591946614421-1fbf5218f7c8?auto=format&fit=crop&q=80&w=1887' }
    ],
    itemCount: 3,
    total: 56.20,
    status: 'Pending Shipment',
    statusColor: 'bg-surface-variant',
    icon: 'schedule'
  }
];

export default function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/30">
      {/* Background elements */}
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
            <h1 className="text-4xl sm:text-6xl font-black text-forest tracking-tighter mb-4">Order History</h1>
            <p className="text-lg text-surface-variant max-w-xl leading-relaxed">
              Review your past purchases and reorder sanctuary essentials for your beloved companions.
            </p>
          </motion.div>
        </header>

        <div className="space-y-6">
          {mockOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl antigravity-shadow relative overflow-hidden group border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-sage/10 transition-colors" />
              
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${order.statusColor} text-white flex items-center justify-center shadow-lg shadow-black/5`}>
                  <span className="material-symbols-outlined text-3xl">{order.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-black text-forest">{order.id}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-surface-variant py-1 px-2 bg-white/40 rounded-full border border-white/60">{order.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-0.5">
                    {order.items.map(item => item.name).join(', ')}
                  </h3>
                  <p className="text-xs text-surface-variant font-medium">
                    {order.itemCount} item{order.itemCount > 1 ? 's' : ''} • 
                    <span 
                      onClick={() => setSelectedOrder(order)}
                      className="text-sage-dark hover:underline cursor-pointer ml-1"
                    >
                      View summary
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 relative z-10 border-t md:border-t-0 md:border-l border-white/40 pt-6 md:pt-0 md:pl-10">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-surface-variant uppercase tracking-widest block mb-0.5">Total Amount</span>
                  <span className="text-2xl font-black text-forest">${order.total.toFixed(2)}</span>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold text-white ${order.statusColor} shadow-md shadow-black/5`}>
                  {order.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      {/* Order Summary Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-forest/20 backdrop-blur-xl" 
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="glass-panel-strong p-8 sm:p-12 rounded-[40px] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-[120px]">{selectedOrder.icon}</span>
              </div>

              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-sage-dark uppercase tracking-[0.2em]">Sanctuary Record</span>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${selectedOrder.statusColor}`}>
                      {selectedOrder.status}
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-forest tracking-tight">{selectedOrder.id}</h2>
                  <p className="text-surface-variant font-medium">{selectedOrder.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sage-dark hover:bg-white/40 transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6 mb-10">
                <h3 className="text-sm font-black text-forest uppercase tracking-widest border-b border-forest/10 pb-2">Itemized Breakdown</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, i) => (
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
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-surface-variant font-medium">Subtotal</span>
                  <span className="font-bold text-forest">${(selectedOrder.total * 0.95).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-surface-variant font-medium">Service Tax (5%)</span>
                  <span className="font-bold text-forest">${(selectedOrder.total * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-forest/10">
                  <span className="text-xl font-black text-forest">Amount Paid</span>
                  <span className="text-3xl font-black text-sage-dark tracking-tighter">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-10 py-4 btn-primary rounded-2xl font-bold flex items-center justify-center gap-2 group overflow-hidden relative"
              >
                <span className="material-symbols-outlined text-white transition-transform group-hover:rotate-12">reorder</span>
                Reorder Sanctuary Bundle
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
