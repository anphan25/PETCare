import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Fashion from './pages/Fashion';
import SpaBooking from './pages/SpaBooking';
import { useCart, useBookings } from './hooks/useStore';

function AnimatedRoutes({ onAddToCart, onBook }) {
  const location = useLocation();

  return (
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
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/spa" element={<SpaBooking onBook={onBook} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { addBooking } = useBookings();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={totalItems} onCartClick={() => setCartOpen(true)} />
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
      </div>
    </BrowserRouter>
  );
}
