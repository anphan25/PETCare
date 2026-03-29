import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

  const [isBumped, setIsBumped] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setIsBumped(true);
    const timer = setTimeout(() => setIsBumped(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

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
    { to: '/hotel', label: 'Hotel' },
    { to: '/spa', label: 'Spa' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 w-[100vw] z-50 px-6 lg:px-8 py-4 bg-white/25 backdrop-blur-xl border-b border-white/50"
      style={{ boxShadow: '0 8px 32px 0 rgba(71,102,58,0.06)' }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src="/logo-transparent.png" 
            alt="PETCare Logo" 
            className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_2px_10px_rgba(71,102,58,0.2)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95" 
          />
          <div className="flex flex-col -mb-1">
            <span className="text-xl sm:text-2xl font-black text-forest -tracking-[0.05em] leading-none">
              PET<span className="text-sage-dark font-light">Care</span>
            </span>
          </div>
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
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <motion.button
            id="cart-icon-container"
            animate={{ scale: isBumped ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCartClick}
            className="relative p-1.5 sm:p-2 hover:bg-white/30 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-sage-dark text-[22px] sm:text-[24px]">shopping_cart</span>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-earth-rose text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white/20"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
 
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => user ? setUserMenuOpen(!userMenuOpen) : onAuthClick()}
              className={`transition-all flex items-center gap-2 ${
                user 
                  ? 'p-1.5 sm:p-2 hover:bg-white/30 rounded-full' 
                  : 'px-4 py-2 bg-sage-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-sage-dark/20 hover:scale-105 active:scale-95'
              }`}
            >
              {user ? (
                <>
                  <img 
                    src={profile?.avatar_url || user.user_metadata?.avatar_url} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-sage-dark/30 object-cover" 
                  />
                  <span className="material-symbols-outlined text-sm text-sage-dark hidden sm:inline">
                    {userMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span className="tracking-tight">Login</span>
                </div>
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
                  className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/98 backdrop-blur-3xl border border-sage/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 py-2"
                >
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="text-sm font-bold text-forest truncate">{profile?.full_name || user.user_metadata?.full_name}</p>
                    <p className="text-xs text-surface-variant truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <NavLink 
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-forest font-medium hover:bg-white/40 flex items-center gap-3 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-sage">person</span>
                      My Profile
                    </NavLink>
                    <button 
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left"
                    >
                      <NavLink to="/orders" className="px-4 py-2 text-sm text-forest font-medium hover:bg-white/40 flex items-center gap-3 transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-sage">history</span>
                        Order History
                      </NavLink>
                    </button>
                    <button 
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left"
                    >
                      <NavLink to="/spa-bookings" className="px-4 py-2 text-sm text-forest font-medium hover:bg-white/40 flex items-center gap-3 transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-sage">spa</span>
                        My Spa Bookings
                      </NavLink>
                    </button>
                    <button 
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left"
                    >
                      <NavLink to="/hotel-bookings" className="px-4 py-2 text-sm text-forest font-medium hover:bg-white/40 flex items-center gap-3 transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-sage">hotel</span>
                        My Hotel Bookings
                      </NavLink>
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
            className="md:hidden p-1.5 sm:p-2 hover:bg-white/30 rounded-full shrink-0"
          >
            <span className="material-symbols-outlined text-sage-dark text-[26px]">
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
              <NavLink
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-colors ${isActive
                    ? 'bg-sage/20 text-sage-dark font-semibold'
                    : 'text-surface-variant hover:text-sage-dark'
                  }`
                }
              >
                Order History
              </NavLink>
              <NavLink
                to="/spa-bookings"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-colors ${isActive
                    ? 'bg-sage/20 text-sage-dark font-semibold'
                    : 'text-surface-variant hover:text-sage-dark'
                  }`
                }
              >
                My Spa Bookings
              </NavLink>
              <NavLink
                to="/hotel-bookings"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-colors ${isActive
                    ? 'bg-sage/20 text-sage-dark font-semibold'
                    : 'text-surface-variant hover:text-sage-dark'
                  }`
                }
              >
                My Hotel Bookings
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
