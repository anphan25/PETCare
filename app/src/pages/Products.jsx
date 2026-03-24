import { motion } from 'framer-motion';
import { useState } from 'react';
import { foodProducts } from '../data/products';

const categories = ['All', 'Dog Food', 'Cat Food', 'Treats', 'Supplements'];

export default function Products({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? foodProducts : foodProducts.filter(p => p.category === activeCategory);

  return (
    <div className="mesh-gradient min-h-screen">
      <main className="pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sage-dark" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-sage-dark">Premium Nutrition</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-forest tracking-tight mb-4">Pet Food Shop</h1>
          <p className="text-xl text-surface-variant max-w-2xl leading-relaxed">
            Curated gourmet meals and supplements for your beloved companions.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-sage-dark text-white shadow-lg shadow-sage/30'
                  : 'glass-panel text-surface-variant hover:text-sage-dark hover:bg-white/40'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="glass-panel rounded-2xl overflow-hidden antigravity-shadow group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  alt={product.name}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                  src={product.image}
                />
                {/* Floating food icon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  className="absolute top-3 left-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sage-dark text-lg">{product.icon}</span>
                </motion.div>
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-sage-dark/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {product.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-charcoal text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-surface-variant mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-sage text-sm" style={{ fontVariationSettings: s <= product.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                  ))}
                  <span className="text-xs text-surface-variant ml-1">{product.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-sage-dark">${product.price.toFixed(2)}</span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onAddToCart(product)}
                    className="px-5 py-2 bg-sage-dark text-white rounded-full text-sm font-semibold flex items-center gap-1.5 hover:shadow-lg hover:shadow-sage/30 transition-shadow"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
