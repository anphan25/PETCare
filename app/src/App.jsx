import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import SpaBooking from './pages/SpaBooking';
import InteractiveMascot from './components/InteractiveMascot';
import AuthModal from './components/AuthModal';
import { useCart, useBookings } from './hooks/useStore';
import { supabase } from './supabaseClient';
import { useAuthStore } from './stores/useAuthStore';

function AnimatedRoutes({ onAddToCart, onBook }) {
  const location = useLocation();
  const showMascot = ['/products', '/spa'].includes(location.pathname);
  useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token đã được làm mới tự động');
    }
    if (event === 'SIGNED_OUT' || !session) {
      // Khi session chết, tự động clear giỏ hàng và đá về trang Login
      console.log("Phiên đăng nhập hết hạn!");
      // window.location.href = '/login'; 
    }
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Dashboard onAddToCart={onAddToCart} />} />
            <Route path="/products" element={<Products onAddToCart={onAddToCart} />} />
            <Route path="/spa" element={<SpaBooking onBook={onBook} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {showMascot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-9999 pointer-events-none"
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
  const { setUser, setProfile, setLoading } = useAuthStore();

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

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          cartCount={totalItems} 
          onCartClick={() => setCartOpen(true)} 
          onAuthClick={() => setAuthOpen(true)}
        />
        <AnimatedRoutes onAddToCart={addToCart} onBook={addBooking} />
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
      </div>
    </BrowserRouter>
  );
}
