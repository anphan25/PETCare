import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../stores/useAuthStore';
import PageLoader from '../components/PageLoader';
import { useMinimumLoading } from '../hooks/useMinimumLoading';

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { label: 'Pending Shipment', icon: 'schedule', color: 'bg-surface-variant' };
    case 'paid':
      return { label: 'Processing', icon: 'payments', color: 'bg-sage-dark' };
    case 'shipped':
      return { label: 'In Transit', icon: 'local_shipping', color: 'bg-[#5C8D89]' };
    case 'delivered':
      return { label: 'Delivered', icon: 'check_circle', color: 'bg-forest' };
    default:
      return { label: 'Under Review', icon: 'visibility', color: 'bg-surface-variant' };
  }
};

export default function OrderHistory() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const showLoader = useMinimumLoading(isLoading, 1500);
  const [userOrders, setUserOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (!user) {
      const timer = setTimeout(() => { if (isMounted) setIsLoading(false); }, 500);
      return () => { isMounted = false; clearTimeout(timer); };
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, order_details (id, quantity, unit_price, products (id, name, image_url))`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (isMounted) {
          const formattedOrders = data.map(order => {
            const config = getStatusConfig(order.status);
            const date = new Date(order.created_at).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            });
            const total   = Number(order.total_amount)  || 0;
            const subtotal = total * 0.95;
            const tax      = total * 0.05;
            return {
              id: `ORD-${order.id.slice(0, 4).toUpperCase()}`,
              dbId: order.id,
              date,
              total,
              subtotal,
              tax,
              status: config.label,
              statusColor: config.color,
              icon: config.icon,
              itemCount: order.order_details.reduce((sum, d) => sum + d.quantity, 0),
              items: order.order_details.map(d => ({
                name:  d.products?.name      || 'Sanctuary Item',
                price: Number(d.unit_price)  || 0,
                qty:   d.quantity            || 1,
                image: d.products?.image_url || 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=400',
              })),
              // Hero image = first item's image
              heroImage: order.order_details[0]?.products?.image_url
                || 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=400',
            };
          });
          setUserOrders(formattedOrders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
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
            <h1 className="text-4xl sm:text-6xl font-black text-forest tracking-tighter mb-4">Order History</h1>
            <p className="text-lg text-surface-variant max-w-xl leading-relaxed">
              Review your past purchases and reorder sanctuary essentials for your beloved companions.
            </p>
          </motion.div>
        </header>

        <div className="space-y-6">
          {showLoader ? (
            <PageLoader label="Loading your orders" />
          ) : userOrders.length > 0 ? (
            userOrders.map((order, index) => (
              <motion.div
                key={order.dbId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedOrder(order)}
                className="glass-panel p-6 sm:p-8 rounded-2xl antigravity-shadow relative overflow-hidden group border border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-sage/10 transition-colors" />

                <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
                  {/* Thumbnail grid of item images */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 bg-white/30 shrink-0 group-hover:scale-105 transition-transform duration-700 relative">
                    {order.items.length > 1 ? (
                      <div className="grid grid-cols-2 w-full h-full">
                        {order.items.slice(0, 4).map((item, i) => (
                          <img key={i} src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ))}
                      </div>
                    ) : (
                      <img src={order.heroImage} alt="Order" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-white px-2 py-0.5 bg-forest rounded-md shadow-sm uppercase tracking-tighter shrink-0">{order.id}</span>
                      <span className="text-[10px] uppercase font-bold text-surface-variant/80 tracking-widest bg-white/40 px-3 py-0.5 rounded-full border border-white/60 truncate">{order.date}</span>
                    </div>
                    <h3 className="font-black text-forest text-base mb-1 truncate w-full">
                      {order.items.map(i => i.name).join(', ')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-sage-dark shrink-0">inventory_2</span>
                      <span className="text-sm text-charcoal/80 font-bold">
                        {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 relative z-10 border-t md:border-t-0 md:border-l border-white/40 pt-6 md:pt-0 md:pl-10 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-surface-variant uppercase tracking-widest block mb-0.5">Total Amount</span>
                    <span className="text-2xl font-black text-forest">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-4 py-2 rounded-full text-xs font-bold text-white ${order.statusColor} shadow-md whitespace-nowrap flex items-center gap-1.5`}>
                      <span className="material-symbols-outlined text-[14px]">{order.icon}</span>
                      {order.status}
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
              <span className="material-symbols-outlined text-6xl text-sage-dark/30 mb-6 block">shopping_bag</span>
              <h3 className="text-2xl font-bold text-forest mb-2">No Orders Yet</h3>
              <p className="text-surface-variant mb-8">Your pet's sanctuary is waiting for its first premium items.</p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
                Explore Shop
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Detail Modal — matches Hotel/Spa pattern */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
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
                {selectedOrder.items.length > 1 ? (
                  <div className="grid grid-cols-2 w-full h-full">
                    {selectedOrder.items.slice(0, 4).map((item, i) => (
                      <img key={i} src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ))}
                  </div>
                ) : (
                  <img src={selectedOrder.heroImage} alt="Order" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />

                {/* Close btn */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-white text-lg">close</span>
                </button>

                {/* Status + ID pills */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-black text-white ${selectedOrder.statusColor} shadow-lg backdrop-blur-sm uppercase tracking-wide flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-[13px]">{selectedOrder.icon}</span>
                    {selectedOrder.status}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-[11px] font-black text-white bg-black/30 backdrop-blur-sm uppercase tracking-wide">
                    {selectedOrder.id}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                {/* Title */}
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-sage-dark mb-1">Order Summary</p>
                  <p className="text-sm text-surface-variant">{selectedOrder.date}</p>
                </div>

                {/* Items list */}
                <div className="mb-5 space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                  <h3 className="text-xs font-black text-forest uppercase tracking-widest border-b border-forest/10 pb-2 mb-3">Items Ordered</h3>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/60 rounded-2xl p-3 border border-white/60">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-charcoal text-sm truncate">{item.name}</p>
                        <p className="text-xs text-surface-variant">Qty: {item.qty}</p>
                      </div>
                      <span className="font-black text-forest text-sm shrink-0">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="bg-forest/5 rounded-2xl p-5 border border-forest/8 mb-6 space-y-2.5">
                  <h3 className="text-xs font-black text-forest uppercase tracking-widest border-b border-forest/10 pb-2.5 mb-3">Price Breakdown</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-variant">Subtotal</span>
                    <span className="font-bold text-charcoal">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-variant">Service Tax (5%)</span>
                    <span className="font-bold text-charcoal">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-forest/10">
                    <span className="text-base font-black text-forest">Total Paid</span>
                    <span className="text-2xl font-black text-sage-dark tracking-tight">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-sage-dark bg-sage/15 py-2.5 rounded-full">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Sanctuary Certified • Premium Quality Guaranteed
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
