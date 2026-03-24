import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/spa', label: 'Spa Booking' },
    { to: '/fashion', label: 'Fashion' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 px-6 lg:px-8 py-4 bg-white/25 backdrop-blur-xl border-b border-white/50"
      style={{ boxShadow: '0 8px 32px 0 rgba(71,102,58,0.06)' }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-sage-dark">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
          PETCare
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 tracking-tight text-sm font-medium">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors duration-300 ${isActive
                  ? 'text-sage-dark border-b-2 border-sage-dark pb-1'
                  : 'text-surface-variant hover:text-sage-dark'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCartClick}
            className="relative p-2 hover:bg-white/30 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-sage-dark">shopping_cart</span>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-earth-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button className="p-2 hover:bg-white/30 rounded-full transition-all">
            <span className="material-symbols-outlined text-sage-dark">account_circle</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 hover:bg-white/30 rounded-full"
          >
            <span className="material-symbols-outlined text-sage-dark">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-4 pb-2">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl transition-colors ${isActive
                      ? 'bg-sage/20 text-sage-dark font-semibold'
                      : 'text-surface-variant hover:text-sage-dark'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
