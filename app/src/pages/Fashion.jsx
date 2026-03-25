import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { fashionItems } from '../data/products';
import { useMascotStore } from '../stores/useMascotStore';

const filterCategories = ['All', 'Clothing', 'Accessories', 'Footwear'];

export default function Fashion() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const setWagging = useMascotStore((state) => state.setWagging);
  const triggerJump = useMascotStore((state) => state.triggerJump);

  const filtered = activeFilter === 'All' ? fashionItems : fashionItems.filter(i => i.category === activeFilter);

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="mesh-gradient min-h-screen">
      <main className="pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>apparel</span>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sage-dark">Lookbook</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-forest tracking-tight mb-4">Pet Fashion</h1>
          <p className="text-xl text-surface-variant max-w-2xl leading-relaxed">
            Discover the latest in pet couture. Stylish, comfortable, and made with love.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3 mb-10">
          {filterCategories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-sage-dark text-white shadow-lg shadow-sage/30'
                  : 'glass-panel text-surface-variant hover:text-sage-dark'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Fashion Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layoutId={`fashion-card-${item.id}`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              onClick={() => setSelectedItem(item)}
              onMouseEnter={() => setWagging(true)}
              onMouseLeave={() => setWagging(false)}
              className="glass-panel rounded-2xl overflow-hidden antigravity-shadow cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  layoutId={`fashion-image-${item.id}`}
                  alt={item.name}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                  src={item.image}
                />
                <motion.button
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); toggleFav(item.id); }}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-earth-rose" style={{ fontVariationSettings: favorites.includes(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </motion.button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <motion.p layoutId={`fashion-name-${item.id}`} className="text-white font-semibold text-lg">{item.name}</motion.p>
                  <motion.p layoutId={`fashion-price-${item.id}`} className="text-sage-light font-bold text-xl">${item.price.toFixed(2)}</motion.p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2">
                  {item.colors.map(c => (
                    <span key={c} className="px-3 py-1 text-[10px] font-medium glass-panel rounded-full text-surface-variant">{c}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detail Modal — Shared Element Transition */}
        <AnimatePresence>
          {selectedItem && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
              />
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
                <motion.div
                  layoutId={`fashion-card-${selectedItem.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="glass-panel-strong rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto antigravity-shadow"
                >
                  <div className="relative">
                    <motion.img
                      layoutId={`fashion-image-${selectedItem.id}`}
                      alt={selectedItem.name}
                      className="w-full h-80 object-cover"
                      src={selectedItem.image}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </motion.button>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-sage-dark font-bold">{selectedItem.category}</span>
                        <motion.h2 layoutId={`fashion-name-${selectedItem.id}`} className="text-3xl font-bold text-forest mt-1">{selectedItem.name}</motion.h2>
                      </div>
                      <motion.p layoutId={`fashion-price-${selectedItem.id}`} className="text-3xl font-black text-sage-dark">${selectedItem.price.toFixed(2)}</motion.p>
                    </div>
                    <p className="text-surface-variant mb-6 leading-relaxed">{selectedItem.description}</p>

                    <div className="space-y-4 mb-8">
                      <div>
                        <h4 className="text-sm font-bold text-charcoal mb-2">Size</h4>
                        <div className="flex gap-2">
                          {selectedItem.sizes.map((size, si) => (
                            <button key={size} className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${si === 1 ? 'bg-sage-dark text-white shadow-lg' : 'glass-panel text-charcoal hover:border-sage-dark'}`}>{size}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-charcoal mb-2">Color</h4>
                        <div className="flex gap-2">
                          {selectedItem.colors.map(color => (
                            <span key={color} className="px-4 py-2 text-xs font-medium glass-panel rounded-full text-surface-variant">{color}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={() => triggerJump()}
                        className="flex-1 py-4 btn-primary text-base flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        Add to Bag
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFav(selectedItem.id)}
                        className="w-14 h-14 glass-panel rounded-full flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-earth-rose" style={{ fontVariationSettings: favorites.includes(selectedItem.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
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
