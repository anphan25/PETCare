import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../stores/useAuthStore';
import { useMascotStore } from '../stores/useMascotStore';
import { useTranslation } from 'react-i18next';

export default function AuthModal({ isOpen, onClose }) {
  const { user, profile } = useAuthStore();
  const setWagging = useMascotStore((state) => state.setWagging);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setWagging(true); // Mascot wag tail
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error.message);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error logging out:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-sage-dark/10 backdrop-blur-sm"
          />
          
          {/* Glassmorphism Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10 max-h-[95vh] overflow-y-auto overflow-x-hidden text-center"
          >
            {/* Background mesh accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-sand rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-sage-dark mb-2 tracking-tight">PETCare</h2>
              
              {!user ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <p className="text-ivory text-base mb-8 font-medium">{t('auth.welcomeBack')}</p>
                  
                  <button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 border border-white/30 transition-all rounded-2xl py-3.5 text-sage-dark font-bold shadow-sm"
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <title>Google</title>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {loading ? t('auth.redirecting') : t('auth.loginWithGmail')}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/40 shadow-xl mb-4 p-1 bg-white/10 backdrop-blur-md">
                    <img src={profile?.avatar_url || user.user_metadata?.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-forest mb-1">
                    {t('auth.hello', { name: profile?.full_name || user.user_metadata?.full_name?.split(' ')[0] })}
                  </h3>
                  <p className="text-sm text-surface-variant mb-6 font-medium">{t('auth.petMissesYou')}</p>
                  
                  <button
                    onClick={signOut}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-sage-dark hover:bg-forest transition-colors rounded-2xl py-3 text-white font-bold shadow-md"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    {t('nav.logout')}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
