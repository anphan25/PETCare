'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import LoadingScreen from './LoadingScreen';
import AuthModal from './AuthModal';
import { useCart, useBookings, useAuthStore } from '@/hooks/useReduxStore';
import { supabase } from '@/lib/supabaseClient';
import { useMinimumLoading } from '@/hooks/useMinimumLoading';

// three.js Canvas cannot render on the server — load it client-side only
const InteractiveMascot = dynamic(() => import('./InteractiveMascot'), { ssr: false });

export default function AppShell({ children }) {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { addBooking } = useBookings();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState([]);
  const { user, setUser, setProfile, setLoading, isLoading } = useAuthStore();
  const showLoadingScreen = useMinimumLoading(isLoading, 1500);
  const pathname = usePathname();
  const showMascot = pathname === '/';

  // ── Supabase auth listener ────────────────────────────────────────────────
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

    let initialized = false;

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      initialized = true;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!initialized) return;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user).catch(console.error);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Global "fly-to-cart" animation ───────────────────────────────────────
  useEffect(() => {
    const handleFlyEvent = (e) => {
      const { startPos, image } = e.detail;
      const cartIcon = document.getElementById('cart-icon-container');
      const targetRect = cartIcon
        ? cartIcon.getBoundingClientRect()
        : { left: window.innerWidth - 60, top: 20, width: 0, height: 0 };
      const targetPos = {
        x: targetRect.left + targetRect.width / 2 - 24,
        y: targetRect.top + targetRect.height / 2 - 24,
      };
      const id = Date.now() + Math.random();
      setFlyingItems((prev) => [...prev, { id, startPos, targetPos, image }]);
      setTimeout(() => setFlyingItems((prev) => prev.filter((item) => item.id !== id)), 2000);
    };

    window.addEventListener('fly-to-cart', handleFlyEvent);
    return () => window.removeEventListener('fly-to-cart', handleFlyEvent);
  }, []);

  return (
    <>
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
          <motion.main
            key={pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1"
          >
            {children}
          </motion.main>
        )}

        <Footer />

        {/* 3D Mascot — only on home page, never SSR */}
        <AnimatePresence>
          {showMascot && !showLoadingScreen && (
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

        <CartDrawer
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          totalPrice={totalPrice}
        />

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

        {/* Flying item animation overlay */}
        <AnimatePresence>
          {flyingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ x: item.startPos.x, y: item.startPos.y, opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ x: item.targetPos.x, y: item.targetPos.y, opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.2], rotate: 720 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 z-[200] pointer-events-none w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-white"
            >
              <img src={item.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-sage-dark/20 mix-blend-overlay" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
