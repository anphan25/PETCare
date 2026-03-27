import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../supabaseClient';

export default function Navbar({ cartCount = 0, onCartClick, onAuthClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile } = useAuthStore();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Clear UI instantly
      setUserMenuOpen(false);
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setProfile(null);
      
      // Call Supabase sign out
      await supabase.auth.signOut();
      
      // Full reload to clear any residual cache or listener issues
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/spa', label: 'Spa Booking' },
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

          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => user ? setUserMenuOpen(!userMenuOpen) : onAuthClick()}
              className="p-2 hover:bg-white/30 rounded-full transition-all flex items-center gap-2"
            >
              {user ? (
                <>
                  <img 
                    src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                    alt="Avatar" 
                    className="w-7 h-7 rounded-full border border-sage-dark/30 object-cover" 
                  />
                  {userMenuOpen ? (
                    <span className="material-symbols-outlined text-sm text-sage-dark">expand_less</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm text-sage-dark">expand_more</span>
                  )}
                </>
              ) : (
                <span className="material-symbols-outlined text-sage-dark">account_circle</span>
              )}
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {user && userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel-strong border border-white/50 overflow-hidden shadow-2xl z-50 py-2"
                >
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-bold text-forest truncate">{profile?.full_name || user.user_metadata?.full_name}</p>
                    <p className="text-xs text-surface-variant truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-forest font-medium hover:bg-white/40 flex items-center gap-3 transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-sage">person</span>
                      My Profile
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-forest font-medium hover:bg-white/40 flex items-center gap-3 transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-sage">event_note</span>
                      My Bookings
                    </button>
                  </div>
                  
                  <div className="border-t border-white/20 py-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-earth-rose font-bold hover:bg-earth-rose/10 flex items-center gap-3 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
