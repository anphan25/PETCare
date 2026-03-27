import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { useMascotStore } from '../stores/useMascotStore';
import { supabase } from '../supabaseClient';

const sortOptions = [
  { label: 'Recommended', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const ITEMS_PER_PAGE = 50;

export default function Products({ onAddToCart }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Fetch Products from Supabase
  useEffect(() => {
    console.log("fetching data")
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');
        console.log("data: ", data)
        if (error) throw error;
        setAllProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return ['All', ...new Set(allProducts.map(p => p.category))];
  }, [allProducts]);

  // Search Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const setWagging = useMascotStore((state) => state.setWagging);
  const triggerJump = useMascotStore((state) => state.triggerJump);

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const processedProducts = useMemo(() => {
    let result = [...allProducts];

    if (debouncedSearchQuery.trim()) {
      result = result.filter(p => p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
    }

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (activeSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allProducts, activeCategory, debouncedSearchQuery, activeSort]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  // if (currentPage > totalPages && totalPages > 0) {
  //   setCurrentPage(1);
  // }
  
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="mesh-gradient min-h-screen">
      <main className="pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sage-dark">All Products</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-forest tracking-tight mb-4">Pet Shop</h1>
          <p className="text-lg sm:text-xl text-surface-variant max-w-2xl leading-relaxed">
            Everything your pet needs, from gourmet meals to stylish couture.
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 p-6 glass-panel-strong border-earth-rose/30 bg-earth-rose/5 rounded-2xl text-center">
            <span className="material-symbols-outlined text-earth-rose text-4xl mb-2">error</span>
            <h3 className="text-xl font-bold text-earth-rose mb-1">Could not load products</h3>
            <p className="text-surface-variant mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-sage-dark text-white rounded-full font-bold hover:bg-forest transition-colors shadow-lg shadow-sage/20 font-inter"
            >
              Retry Connection
            </button>
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center justify-between"
        >
          {/* Unified Search Bar */}
          <div className="relative flex-1 max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
              <span className="material-symbols-outlined text-sage-dark group-focus-within:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                search
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Search premium products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl glass-panel-strong border border-white/40 focus:outline-none focus:ring-4 focus:ring-sage/20 focus:border-sage-dark transition-all placeholder:text-surface-variant/60 text-forest font-medium h-[60px]"
            />
          </div>

          <div className="flex gap-4">
            {/* Unified Sort Dropdown */}
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <span className="material-symbols-outlined text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>
                  sort
                </span>
              </div>
              <select 
                value={activeSort}
                onChange={(e) => { setActiveSort(e.target.value); setCurrentPage(1); }}
                className="w-full md:w-56 pl-12 pr-10 py-4 rounded-2xl glass-panel-strong border border-white/40 focus:outline-none focus:ring-4 focus:ring-sage/20 focus:border-sage-dark appearance-none bg-transparent cursor-pointer font-bold text-forest transition-all h-[60px]"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-white py-2 text-forest font-medium">{opt.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                <span className="material-symbols-outlined text-sage-dark group-hover:translate-y-[-2px] transition-transform">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filters with Icons */}
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="flex flex-nowrap md:flex-wrap gap-3 mb-12 pb-4 md:pb-0 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map(cat => {
            const iconMap = {
              'All': 'grid_view',
              'Accessory': 'stars',
              'Fashion': 'apparel',
              'Food': 'nutrition',
            };
            const icon = iconMap[cat] || 'label';
            
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-500 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-sage-dark text-white shadow-[0_10px_25px_-5px_rgba(157,192,139,0.5)] border-transparent'
                    : 'glass-panel text-forest/70 hover:text-sage-dark border-white/40 hover:bg-white/50'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeCategory === cat ? 'text-white' : 'text-sage-dark'}`} style={{ fontVariationSettings: activeCategory === cat ? "'FILL' 1" : "'FILL' 0" }}>
                  {icon}
                </span>
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Loading Skeleton
              [...Array(8)].map((_, i) => (
                <div key={i} className="glass-panel h-[400px] rounded-2xl animate-pulse bg-white/20" />
              ))
            ) : paginatedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layoutId={`product-card-${product.id}`}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: (i % 10) * 0.05 }}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                onClick={() => setSelectedItem(product)}
                onMouseEnter={() => setWagging(true)}
                onMouseLeave={() => setWagging(false)}
                className="glass-panel rounded-2xl overflow-hidden antigravity-shadow group cursor-pointer flex flex-col"
              >
                <div className="relative overflow-hidden h-52 shrink-0">
                  <motion.img
                    layoutId={`product-image-${product.id}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={product.image_url || product.image}
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-sage-dark/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                    {product.category}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-earth-rose" style={{ fontVariationSettings: favorites.includes(product.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </motion.button>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <motion.h3 layoutId={`product-name-${product.id}`} className="font-bold text-charcoal text-lg mb-1">{product.name}</motion.h3>
                  
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="material-symbols-outlined text-sage text-sm" style={{ fontVariationSettings: s <= product.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                      <span className="text-xs text-surface-variant ml-1">{product.rating}</span>
                    </div>
                  )}

                  {!product.rating && product.colors && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {product.colors.map(c => (
                        <span key={c} className="px-2 py-0.5 text-[10px] font-medium glass-panel rounded-full text-surface-variant">{c}</span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-surface-variant mb-2 line-clamp-2 flex-1">{product.description}</p>
                  
                  {product.stock !== undefined && (
                    <div className="mb-4 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-sage' : 'bg-earth-rose animate-pulse'}`} />
                      <span className="text-[10px] sm:text-xs font-medium text-surface-variant">
                        {product.stock > 0 ? `${product.stock} items left` : 'Out of stock'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-auto">
                    <motion.span layoutId={`product-price-${product.id}`} className="text-2xl font-black text-sage-dark">${product.price.toFixed(2)}</motion.span>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                        triggerJump();
                      }}
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

        {paginatedProducts.length === 0 && (
          <div className="py-20 text-center text-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
            <p className="text-xl">No products found.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full glass-panel disabled:opacity-50 hover:bg-white/40 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-surface-variant font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full glass-panel disabled:opacity-50 hover:bg-white/40 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}

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
                  layoutId={`product-card-${selectedItem.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-panel-strong rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto antigravity-shadow relative flex flex-col md:flex-row"
                  style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                >
                  <div className="relative w-full md:w-5/12 h-64 md:h-auto shrink-0">
                    <motion.img
                      layoutId={`product-image-${selectedItem.id}`}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                      src={selectedItem.image_url || selectedItem.image}
                    />
                    {selectedItem.stock !== undefined && (
                     <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-bold text-white shadow-xl">
                        {selectedItem.stock} in stock
                     </div>
                    )}
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
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sage-dark font-bold">{selectedItem.category}</span>
                        <motion.h2 layoutId={`product-name-${selectedItem.id}`} className="text-2xl sm:text-3xl font-bold text-forest mt-1 leading-tight">{selectedItem.name}</motion.h2>
                      </div>
                      <motion.p layoutId={`product-price-${selectedItem.id}`} className="text-2xl sm:text-3xl font-black text-sage-dark shrink-0">${selectedItem.price.toFixed(2)}</motion.p>
                    </div>

                    {selectedItem.rating && (
                      <div className="flex items-center gap-1 mb-4">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="material-symbols-outlined text-sage text-sm" style={{ fontVariationSettings: s <= selectedItem.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        ))}
                        <span className="text-xs sm:text-sm text-surface-variant ml-2">{selectedItem.rating} Rating</span>
                      </div>
                    )}

                    <p className="text-sm sm:text-base text-surface-variant mb-6 leading-relaxed">{selectedItem.description}</p>

                    {selectedItem.sizes && (
                      <div className="space-y-4 mb-8">
                        <div>
                          <h4 className="text-xs font-bold text-charcoal mb-2 uppercase tracking-wide">Size</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.sizes.map((size, si) => (
                              <button key={size} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold transition-all ${si === 1 ? 'bg-sage-dark text-white shadow-lg' : 'glass-panel text-charcoal hover:border-sage-dark'}`}>{size}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-charcoal mb-2 uppercase tracking-wide">Color</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.colors.map(color => (
                              <span key={color} className="px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-medium glass-panel rounded-full text-surface-variant">{color}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 sm:gap-4 mt-8">
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={() => {
                          onAddToCart(selectedItem);
                          triggerJump();
                          setSelectedItem(null);
                        }}
                        className="flex-1 py-3 sm:py-4 btn-primary text-sm sm:text-base flex items-center justify-center gap-2 rounded-2xl">
                        <span className="material-symbols-outlined text-xl">shopping_bag</span>
                        Add to Bag
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFav(selectedItem.id)}
                        className="w-12 h-12 sm:w-14 sm:h-14 glass-panel rounded-2xl flex items-center justify-center shrink-0"
                      >
                        <span className="material-symbols-outlined text-earth-rose text-xl sm:text-2xl" style={{ fontVariationSettings: favorites.includes(selectedItem.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
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
