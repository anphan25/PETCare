import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { supabase } from '../supabaseClient';
import PageLoader from '../components/PageLoader';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';


export default function Wishlist({ onAddToCart }) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { wishlistIds, fetchWishlist, toggleWishlist } = useWishlistStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch wishlist IDs then fetch the actual products
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      await fetchWishlist(user.id);
      if (!isMounted) return;
      // After fetch, wishlistIds in store is updated; we read directly from supabase
      const { data: wishlistRows } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);
      if (!isMounted) return;
      const ids = (wishlistRows || []).map((r) => r.product_id);
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);
      if (isMounted) {
        setProducts(productData || []);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [user, fetchWishlist]);

  // Re-sync products when wishlistIds change (after toggle)
  useEffect(() => {
    if (!user) return;
    const ids = Array.from(wishlistIds);

    // Always go through an async path so setState is never called
    // synchronously inside the effect body (avoids cascading-render warning).
    const query = ids.length === 0
      ? Promise.resolve({ data: [] })
      : supabase.from('products').select('*').in('id', ids);

    query.then(({ data }) => { setProducts(data ?? []); });
  }, [wishlistIds, user]);

  const handleRemove = async (productId) => {
    if (!user) return;
    await toggleWishlist(user.id, productId);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const btnRect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: btnRect.left + btnRect.width / 2 - 24,
      y: btnRect.top + btnRect.height / 2 - 24,
    };
    window.dispatchEvent(new CustomEvent('fly-to-cart', {
      detail: { startPos, image: product.image_url || product.image },
    }));
    onAddToCart(product);
  };

  if (!user) {
    return (
      <div className="mesh-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-earth-rose mb-4 block opacity-60">favorite</span>
          <h2 className="text-2xl font-bold text-forest mb-2">{t('auth.signInToView')}</h2>
          <p className="text-surface-variant">{t('auth.saveFavourites')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-gradient min-h-screen">
      <main className="pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-earth-rose" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-earth-rose">{t('wishlist.title')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-forest tracking-tight mb-4">
            {t('wishlist.pageTitle')}
          </h1>
          <p className="text-lg text-surface-variant max-w-2xl leading-relaxed">
            {wishlistIds.size === 0
              ? t('wishlist.emptyWishlist')
              : t('wishlist.itemsSaved', { count: wishlistIds.size })}
          </p>
        </motion.div>

        {loading ? (
          <PageLoader label={t('wishlist.loadingWishlist')} />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 flex flex-col items-center justify-center text-center gap-6"
          >
            <div className="w-28 h-28 rounded-full bg-earth-rose/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-earth-rose/50">heart_broken</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-forest mb-2">{t('wishlist.emptyTitle')}</h3>
              <p className="text-surface-variant mb-6">{t('wishlist.emptyDescription')}</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-sage-dark text-white rounded-2xl font-bold hover:bg-forest transition-colors shadow-lg shadow-sage/20"
              >
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                {t('wishlist.browseProducts')}
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  layoutId={`wishlist-card-${product.id}`}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ delay: (i % 8) * 0.05 }}
                  whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  onClick={() => setSelectedItem(product)}
                  className="glass-panel rounded-2xl overflow-hidden antigravity-shadow group cursor-pointer flex flex-col"
                >
                  <div className="relative overflow-hidden h-52 shrink-0">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={product.image_url || product.image}
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-sage-dark/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {product.category}
                    </div>
                    {/* Remove from wishlist */}
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="material-symbols-outlined text-earth-rose" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </motion.button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-charcoal text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-surface-variant mb-3 line-clamp-2 flex-1">{product.description}</p>

                    {product.stock !== undefined && (
                      <div className="mb-3 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-sage' : 'bg-earth-rose animate-pulse'}`} />
                        <span className="text-xs font-medium text-surface-variant">
                          {product.stock > 0 ? `${product.stock} items left` : 'Out of stock'}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-2xl font-black text-sage-dark">${product.price.toFixed(2)}</span>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => handleAddToCart(e, product)}
                        className="px-4 py-2 bg-sage-dark text-white rounded-full text-sm font-semibold flex items-center gap-1.5 hover:shadow-lg hover:shadow-sage/30 transition-shadow"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        Add
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60"
              />
              <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedItem(null)}>
                <motion.div
                  layoutId={`wishlist-card-${selectedItem.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-panel-strong rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto antigravity-shadow relative flex flex-col md:flex-row"
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                >
                  <div className="relative w-full md:w-5/12 h-64 md:h-auto shrink-0">
                    <img
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                      src={selectedItem.image_url || selectedItem.image}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg md:hidden"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </motion.button>
                  </div>
                  <div className="p-6 sm:p-8 flex-1">
                    <div className="hidden md:flex justify-end mb-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedItem(null)}
                        className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white/60 transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </motion.button>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 pr-4">
                        <span className="text-xs uppercase tracking-widest text-sage-dark font-bold">{selectedItem.category}</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-forest mt-1 leading-tight">{selectedItem.name}</h2>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-sage-dark shrink-0">${selectedItem.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm sm:text-base text-surface-variant mb-6 leading-relaxed">{selectedItem.description}</p>

                    <div className="flex gap-3 sm:gap-4 mt-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => { handleAddToCart(e, selectedItem); setSelectedItem(null); }}
                        className="flex-1 py-3 sm:py-4 btn-primary text-sm sm:text-base flex items-center justify-center gap-2 rounded-2xl"
                      >
                        <span className="material-symbols-outlined text-xl">shopping_bag</span>
                        Add to Bag
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); handleRemove(selectedItem.id); setSelectedItem(null); }}
                        className="w-12 h-12 sm:w-14 sm:h-14 glass-panel rounded-2xl flex items-center justify-center shrink-0"
                      >
                        <span className="material-symbols-outlined text-earth-rose text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
