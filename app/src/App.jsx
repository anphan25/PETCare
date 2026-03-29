import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoadingScreen from './components/LoadingScreen';
import InteractiveMascot from './components/InteractiveMascot';
import AuthModal from './components/AuthModal';
import { useCart, useBookings } from './hooks/useStore';
import { supabase } from './supabaseClient';
import { useAuthStore } from './stores/useAuthStore';
import { useMinimumLoading } from './hooks/useMinimumLoading';

// Lazy load pages for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const SpaBooking = lazy(() => import('./pages/SpaBooking'));
const HotelBooking = lazy(() => import('./pages/HotelBooking'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const SpaBookingHistory = lazy(() => import('./pages/SpaBookingHistory'));
const HotelBookingHistory = lazy(() => import('./pages/HotelBookingHistory'));
const Profile = lazy(() => import('./pages/Profile'));

function ProtectedRoute({ children, user, onAuthOpen }) {
  useEffect(() => {
    if (!user) {
      onAuthOpen();
    }
  }, [user, onAuthOpen]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AnimatedRoutes({ onAddToCart, onBook, user, onAuthOpen }) {
  const location = useLocation();
  const mascotRoutes = ['/'];
  const showMascot = mascotRoutes.includes(location.pathname);

  // Reset scroll on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Suspense fallback={<LoadingScreen />}>
            <Routes location={location}>
              <Route path="/" element={<Dashboard onAddToCart={onAddToCart} />} />
              <Route path="/products" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <Products onAddToCart={onAddToCart} />
                </ProtectedRoute>
              } />
              <Route path="/spa" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <SpaBooking onBook={onBook} />
                </ProtectedRoute>
              } />
              <Route path="/hotel" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <HotelBooking onBook={onBook} />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <OrderHistory />
                </ProtectedRoute>
              } />
              <Route path="/spa-bookings" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <SpaBookingHistory />
                </ProtectedRoute>
              } />
              <Route path="/hotel-bookings" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <HotelBookingHistory />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute user={user} onAuthOpen={onAuthOpen}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {showMascot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-40 pointer-events-none"
          >
            <InteractiveMascot />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { addBooking } = useBookings();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const { user, setUser, setProfile, setLoading, loading } = useAuthStore();
  const showLoadingScreen = useMinimumLoading(loading, 1500);

  useEffect(() => {
    const fetchProfile = async (user) => {
      try {
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          const { user_metadata: meta } = user;
          const newProfile = {
            id: user.id,
            full_name: meta?.full_name || '',
            avatar_url: meta?.avatar_url || '',
            email: user.email,
          };
          const { data: inserted, error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          if (insertError) throw insertError;
          data = inserted;
        } else if (error) {
          throw error;
        }
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    // // Check active session
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setUser(session?.user ?? null);
    //   if (session?.user) fetchProfile(session.user);
    //   else setLoading(false);
    // });

    // // Listen for auth changes
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
    //   setUser(session?.user ?? null);
    //   if (session?.user) {
    //     await fetchProfile(session.user);
    //   } else {
    //     setProfile(null);
    //     setLoading(false);
    //   }
    // });

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();

    // 3. Listen auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user).catch(console.error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Global "Fly to Cart" animation handler
  useEffect(() => {
    const handleFlyEvent = (e) => {
      const { startPos, image } = e.detail;
      
      const cartIcon = document.getElementById('cart-icon-container');
      const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { left: window.innerWidth - 60, top: 20 };
      const targetPos = {
        x: targetRect.left + (targetRect.width / 2) - 24,
        y: targetRect.top + (targetRect.height / 2) - 24
      };

      const id = Date.now() + Math.random();
      setFlyingItems(prev => [...prev, { id, startPos, targetPos, image }]);

      setTimeout(() => {
        setFlyingItems(prev => prev.filter(item => item.id !== id));
      }, 2000);
    };

    window.addEventListener('fly-to-cart', handleFlyEvent);
    return () => window.removeEventListener('fly-to-cart', handleFlyEvent);
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showLoadingScreen && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartCount={totalItems} 
          onCartClick={() => setCartOpen(true)} 
          onAuthClick={() => setAuthOpen(true)}
        />
        {!showLoadingScreen && (
           <AnimatedRoutes 
             onAddToCart={addToCart} 
             onBook={addBooking} 
             user={user} 
             onAuthOpen={() => setAuthOpen(true)} 
           />
        )}
        <Footer />
        <CartDrawer
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          totalPrice={totalPrice}
        />
        <AuthModal 
          isOpen={authOpen} 
          onClose={() => setAuthOpen(false)} 
        />

        {/* Global Flying Items Animation Overlay - Outside transition containers */}
        <AnimatePresence>
          {flyingItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ 
                x: item.startPos.x, 
                y: item.startPos.y, 
                opacity: 0, 
                scale: 0.5,
                rotate: 0 
              }}
              animate={{ 
                x: item.targetPos.x, 
                y: item.targetPos.y, 
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.2],
                rotate: 720
              }}
              transition={{ 
                duration: 1.5, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="fixed top-0 left-0 z-[200] pointer-events-none w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-white"
            >
              <img src={item.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-sage-dark/20 mix-blend-overlay" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
