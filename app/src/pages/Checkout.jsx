import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useCart } from '../hooks/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../stores/useAuthStore';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeDelivery, setActiveDelivery] = useState('standard');
  const [showSuccess, setShowSuccess] = useState(false);
  const [confettiItems] = useState(() => {
    return [...Array(20)].map(() => ({
      x: Math.random() * 100,
      drift: Math.random() * 20 - 10,
      duration: 3 + Math.random() * 2,
      size: Math.floor(Math.random() * 6 + 4),
      color: ['#9DC08B', '#E49393', '#47663A', '#FFFFFF'][Math.floor(Math.random() * 4)]
    }));
  });

  const deliveryOptions = useMemo(() => [
    { id: 'standard', name: 'Standard Delivery', time: '3-5 business days', price: 0, icon: 'local_shipping' },
    { id: 'express', name: 'Express Courier', time: '1-2 business days', price: 15, icon: 'speed' },
    { id: 'priority', name: 'Sanctuary Priority', time: 'Next morning premium', price: 35, icon: 'auto_awesome' },
  ], []);

  const selectedDelivery = deliveryOptions.find(d => d.id === activeDelivery);
  const subtotal = totalPrice;
  const tax = subtotal * 0.05;
  const deliveryFee = selectedDelivery ? selectedDelivery.price : 0;
  const grandTotal = subtotal + tax + deliveryFee;



  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    console.log("Preparing to place order...");
    console.log("Current User:", user);
    console.log("Form Data:", formData);

    if (!user) {
      alert("Please sign in to complete your sanctuary order.");
      return;
    }

    if (!formData.fullName || !formData.address || !formData.city) {
      alert("Please fill in all shipping details for your pet's delivery.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        user_id: user.id,
        total_amount: Number(grandTotal.toFixed(2)),
        status: 'pending',
        shipping_address: `${formData.fullName}, ${formData.address}, ${formData.city}`
      };
      
      console.log("1. Calling Supabase Insert Orders:", orderPayload);

      // 1. Insert into 'orders'
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        console.error('Supabase Order Insert Error:', orderError);
        throw orderError;
      }
      
      console.log("Order successfully created:", orderData);

      // 2. Prepare 'order_details'
      // UUID length is 36. Ensures we only pass valid UUIDs if products come from DB. 
      const orderDetails = cart.map(item => ({
        order_id: orderData.id,
        product_id: (item.id && item.id.length >= 32) ? item.id : null, 
        quantity: Number(item.quantity),
        unit_price: Number(item.price)
      }));

      console.log("2. Calling Supabase Insert Order Details:", orderDetails);

      // 3. Insert into 'order_details'
      const { error: detailsError } = await supabase
        .from('order_details')
        .insert(orderDetails);

      if (detailsError) {
        console.error('Supabase Details Insert Error:', detailsError);
        throw detailsError;
      }

      console.log("Order Details successfully inserted.");

      // Update UI
      setLoading(false);
      setShowSuccess(true);
      clearCart();
      
      setTimeout(() => {
        clearCart();
        navigate('/orders');
      }, 4000);

    } catch (error) {
      console.error('Checkout Transaction Error:', error);
      alert(`Sanctuary API Error: ${error.message || "Could not complete order. Please try again."}`);
      setLoading(false);
    }
  };

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="mesh-gradient min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel p-12 rounded-3xl text-center max-w-lg shadow-2xl">
          <span className="material-symbols-outlined text-6xl text-sage-dark mb-6 scale-125 block">shopping_cart_off</span>
          <h2 className="text-3xl font-bold text-forest mb-4">Your Sanctuary is Empty</h2>
          <p className="text-surface-variant mb-10 leading-relaxed">It looks like you haven't added any premium pet supplies yet. Let's find something your pet will love!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sage/20 rounded-full blur-3xl opacity-40" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-earth-rose-light/10 rounded-full blur-3xl opacity-30" 
        />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-sage-dark hover:bg-white/40 transition-all hover:scale-110">
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-sage-dark mb-1">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              Secure Sanctuary Checkout
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">Complete Your Order</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Shipping */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 sm:p-10 rounded-2xl antigravity-shadow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-sage-dark text-white flex items-center justify-center font-black shadow-lg shadow-sage-dark/20">1</div>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal">Shipping Sanctuary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-surface-variant uppercase tracking-widest ml-1">Full Sanctuary Name</label>
                  <div className="relative">
                    <input 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="e.g. Luna Lovegood" 
                      className="checkout-input h-14 pl-12 peer" 
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-dark/60 peer-hover:text-sage peer-focus:text-sage transition-all duration-300 text-[20px] pointer-events-none">person</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-surface-variant uppercase tracking-widest ml-1">Delivery Address</label>
                  <div className="relative">
                    <input 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="123 Harmony Lane" 
                      className="checkout-input h-14 pl-12 peer" 
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-dark/60 peer-hover:text-sage peer-focus:text-sage transition-all duration-300 text-[20px] pointer-events-none">home</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-surface-variant uppercase tracking-widest ml-1">Forest City</label>
                  <div className="relative">
                    <input 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="Evergreen Valley" 
                      className="checkout-input h-14 pl-12 peer" 
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-dark/60 peer-hover:text-sage peer-focus:text-sage transition-all duration-300 text-[20px] pointer-events-none">location_city</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Step 2: Delivery Options */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 sm:p-10 rounded-2xl antigravity-shadow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-sage-dark text-white flex items-center justify-center font-black shadow-lg shadow-sage-dark/20">2</div>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal">Delivery Speed</h2>
              </div>
              <div className="space-y-4">
                {deliveryOptions.map(option => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveDelivery(option.id)}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all border-2 flex items-center gap-5 ${
                      activeDelivery === option.id 
                        ? 'bg-white/50 border-sage-dark shadow-xl ring-4 ring-sage-dark/5 shadow-sage-dark/5' 
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      activeDelivery === option.id ? 'bg-sage-dark text-white shadow-lg' : 'bg-sage/20 text-sage-dark'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">{option.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-base text-forest">{option.name}</span>
                        <span className="font-black text-sage-dark text-sm">{option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}</span>
                      </div>
                      <span className="text-xs text-surface-variant font-medium tracking-wide">{option.time}</span>
                    </div>
                    {activeDelivery === option.id && (
                      <motion.div layoutId="delivery-check" className="text-sage-dark">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Step 3: Payment */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 sm:p-10 rounded-2xl overflow-hidden antigravity-shadow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-sage-dark text-white flex items-center justify-center font-black shadow-lg shadow-sage-dark/20">3</div>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal">Payment Sanctuary</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-5 order-2 md:order-1">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-surface-variant uppercase tracking-widest ml-1">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="•••• •••• •••• ••••" className="checkout-input h-14 pl-12 peer" />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sage-dark/60 peer-hover:text-sage peer-focus:text-sage transition-all duration-300 text-[20px] pointer-events-none">credit_card</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-surface-variant uppercase tracking-widest ml-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="checkout-input h-14 text-center" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-surface-variant uppercase tracking-widest ml-1">CVV</label>
                      <input type="text" placeholder="•••" className="checkout-input h-14 text-center" />
                    </div>
                  </div>
                </div>

                {/* Aesthetic Card Preview */}
                <div className="w-full md:w-64 h-40 bg-linear-to-br from-forest via-sage-dark to-[#5C8D89] rounded-2xl shadow-2xl p-6 text-white relative flex flex-col justify-between order-1 md:order-2 shrink-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <div className="flex justify-between items-start italic font-serif">
                    <span className="text-sm opacity-80 uppercase tracking-widest">Sanctuary</span>
                    <span className="material-symbols-outlined scale-125">payments</span>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-sm opacity-50 font-mono tracking-widest uppercase">Member Card</p>
                    <p className="text-lg font-mono tracking-widest leading-none">•••• •••• •••• 4422</p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-panel p-8 sm:p-10 rounded-2xl antigravity-shadow relative overflow-hidden h-fit"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              </div>
              
              <h3 className="text-2xl font-black text-forest mb-8">Order Summary</h3>
              
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image_url} className="w-14 h-14 rounded-xl object-cover shadow-md" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-charcoal leading-tight mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center uppercase tracking-widest">
                        <span className="text-[10px] font-bold text-surface-variant">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-sage-dark">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/40 p-5 sm:p-6 rounded-xl mb-6 space-y-2 border border-white/40 shadow-inner">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-surface-variant font-medium">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-surface-variant font-medium">Service Tax (5%)</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-surface-variant font-medium">Delivery</span>
                  <span className="font-bold text-sage-dark">{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center pt-3 sm:pt-4 mt-2 border-t border-white/40">
                  <span className="text-base sm:text-lg font-bold">Grand Total</span>
                  <span className="text-xl sm:text-2xl font-black text-sage-dark">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-right mb-6">
                <span className="text-[10px] text-surface-variant font-bold uppercase tracking-widest block mb-1">Items: {cart.length}</span>
                <div className="flex gap-0.5 justify-end">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-sage-dark opacity-30" />
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={loading || !formData.fullName || !formData.address || !formData.city}
                className="w-full py-5 btn-primary rounded-2xl text-xl flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_20px_40px_rgba(157,192,139,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-white transition-transform group-hover:rotate-12">auto_awesome</span>
                    Place Order Now
                  </>
                )}
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-surface-variant/60">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Secured by Sanctuary Encryption
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-forest/20 backdrop-blur-xl" />
            <motion.div 
               initial={{ scale: 0.8, opacity: 0, y: 50 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               className="glass-panel-strong p-6 sm:p-12 rounded-[40px] text-center max-w-lg relative z-10 shadow-2xl"
            >
              <div className="w-20 h-20 bg-sage-dark text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <span className="material-symbols-outlined text-4xl font-black">check</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-forest mb-6 tracking-tight">Place Order Successfully</h2>
              <div className="flex items-center justify-center gap-2 text-sage-dark font-bold text-sm uppercase tracking-widest mt-4">
                <span className="w-2 h-2 rounded-full bg-sage-dark animate-ping" />
                Redirect to order history...
              </div>
            </motion.div>
            
            <div className="absolute inset-0 pointer-events-none">
              {confettiItems.map((item, i) => (
                <motion.div
                   key={i}
                   initial={{ y: -100, x: `${item.x}%`, opacity: 1 }}
                   animate={{ y: 2000, x: `${item.x + item.drift}%`, rotate: 360 }}
                   transition={{ duration: item.duration, repeat: Infinity, ease: "linear" }}
                   className="absolute rounded-sm"
                   style={{ width: item.size, height: item.size, backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
