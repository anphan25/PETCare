import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CartDrawer({ cart, isOpen, onClose, onUpdateQuantity, onRemove, totalPrice }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-100"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-110 glass-panel-strong shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/30">
              <h2 className="text-xl font-bold text-forest">{t('cart.title')}</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/30 rounded-full"
              >
                <span className="material-symbols-outlined text-sage-dark">close</span>
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <span className="material-symbols-outlined text-6xl text-sage mb-4">shopping_cart</span>
                  <p className="text-lg font-medium text-surface-variant">{t('cart.empty')}</p>
                  <p className="text-sm text-outline mt-1">{t('cart.emptyHint')}</p>
                </div>
              ) : (
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50, height: 0 }}
                      className="flex gap-4 p-4 bg-white/40 rounded-2xl border border-white/50"
                    >
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-charcoal truncate">{item.name}</h4>
                        <p className="text-sage-dark font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-sage/20 text-sage-dark flex items-center justify-center text-xs font-bold hover:bg-sage/40 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-sage/20 text-sage-dark flex items-center justify-center text-xs font-bold hover:bg-sage/40 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onRemove(item.id)}
                        className="self-start p-1 text-earth-rose hover:text-red-600"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-surface-variant">{t('cart.total')}</span>
                  <span className="text-2xl font-black text-sage-dark">${totalPrice.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 btn-primary text-lg"
                >
                  {t('cart.checkout')}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
