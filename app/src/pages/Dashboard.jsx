import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { foodProducts, fashionItems, spaServices, heroImage } from '../data/products';

const floatAnimation = {
  y: [0, -8, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

const cardHover = {
  y: -6,
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

function StarRating({ rating }) {
  return (
    <div className="flex text-sage text-xs gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: star <= Math.floor(rating) ? "'FILL' 1" : rating >= star - 0.5 ? "'FILL' 1" : "'FILL' 0" }}>
          {star <= rating ? 'star' : star - 0.5 <= rating ? 'star_half' : 'star'}
        </span>
      ))}
    </div>
  );
}

export default function Dashboard({ onAddToCart }) {
  const topFood = foodProducts.slice(0, 3);
  const topFashion = fashionItems.slice(0, 4);

  return (
    <div className="mesh-gradient min-h-screen">
      <main className="pt-28 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-20 flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          <div className="max-w-2xl">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-forest mb-6 leading-tight"
            >
              Pamper Your Pets with <span className="text-sage-dark">Premium Care</span>
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl text-surface-variant mb-10 leading-relaxed font-light"
            >
              From gourmet food to luxury spa treatments, everything your pet deserves. Experience a sanctuary designed for wellness and joy.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 btn-primary text-base">
                  Explore Now
                </motion.button>
              </Link>
              <Link to="/spa">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-10 py-4 glass-panel text-sage-dark rounded-full font-semibold hover:bg-white/40 transition-all">
                  Book Spa
                </motion.button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative w-full lg:w-1/2 flex justify-center"
          >
            <motion.div animate={floatAnimation} className="absolute -top-10 -right-10 opacity-20 rotate-12">
              <span className="material-symbols-outlined text-sage text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
            </motion.div>
            <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 } }} className="absolute bottom-0 -left-10 opacity-15 -rotate-12">
              <span className="material-symbols-outlined text-sage text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            </motion.div>
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="glass-panel p-4 rounded-2xl antigravity-shadow rotate-3 transition-transform duration-700"
            >
              <img alt="Luxury Pet Spa" className="rounded-xl object-cover w-[400px] h-[500px]" src={heroImage} />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* 3-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Column 1: Pet Food */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-2xl antigravity-shadow"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-sage-dark font-bold">Nutrition</span>
                <h2 className="text-2xl font-bold text-forest mt-1">Premium Pet Food</h2>
              </div>
              <span className="material-symbols-outlined text-sage text-4xl opacity-50">restaurant</span>
            </div>
            <div className="space-y-4">
              {topFood.map((food, i) => (
                <motion.div
                  key={food.id}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={cardHover}
                  className="group relative bg-white/40 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-white/50 cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 antigravity-shadow">
                      <img alt={food.name} className="w-full h-full object-cover" src={food.image} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-charcoal">{food.name}</h3>
                      <StarRating rating={food.rating} />
                      <p className="text-sage-dark font-bold mt-2">${food.price.toFixed(2)}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => onAddToCart(food)}
                      className="self-end p-2 bg-sage-dark text-white rounded-full"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/products">
              <motion.button whileHover={{ scale: 1.02 }} className="mt-6 w-full py-4 glass-panel text-sage-dark font-bold rounded-full hover:bg-white/50 transition-all">
                View All Products
              </motion.button>
            </Link>
          </motion.section>

          {/* Column 2: Fashion */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl antigravity-shadow"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-sage-dark font-bold">Style</span>
                <h2 className="text-2xl font-bold text-forest mt-1">Trendy Pet Fashion</h2>
              </div>
              <span className="material-symbols-outlined text-sage text-4xl opacity-50">apparel</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {topFashion.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={cardHover}
                  className="group relative rounded-2xl overflow-hidden antigravity-shadow cursor-pointer"
                >
                  <img alt={item.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" src={item.image} />
                  <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                    <span className="material-symbols-outlined text-surface-variant text-sm">favorite</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs font-medium">{item.name}</p>
                    <p className="text-sage-light font-bold text-sm">${item.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/fashion">
              <motion.button whileHover={{ scale: 1.02 }} className="mt-6 w-full py-4 bg-sage-dark text-white font-bold rounded-full hover:shadow-lg transition-all">
                View Collection
              </motion.button>
            </Link>
          </motion.section>

          {/* Column 3: Spa */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8 rounded-2xl antigravity-shadow"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-sage-dark font-bold">Wellness</span>
                <h2 className="text-2xl font-bold text-forest mt-1">Luxury Spa & Grooming</h2>
              </div>
              <span className="material-symbols-outlined text-sage text-4xl opacity-50">spa</span>
            </div>

            {/* Mini Calendar */}
            <div className="bg-white/30 rounded-2xl p-4 border border-white/50 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-forest">March 2026</h4>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-sage-dark cursor-pointer">chevron_left</span>
                  <span className="material-symbols-outlined text-sage-dark cursor-pointer">chevron_right</span>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-surface-variant mb-2">
                {['S','M','T','W','T','F','S'].map((d,i) => <span key={i}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {[23,24,25,26,27,28].map(d => <span key={d} className="py-1 opacity-20">{d}</span>)}
                <span className="py-1">1</span>
                <span className="py-1">2</span>
                <span className="py-1 bg-earth-rose-light text-white rounded-full font-bold">3</span>
                <span className="py-1">4</span>
                <span className="py-1">5</span>
                <span className="py-1 bg-sage text-white rounded-full font-bold">6</span>
                <span className="py-1">7</span>
                <span className="py-1">8</span>
                <span className="py-1">9</span>
                <span className="py-1 bg-sage text-white rounded-full font-bold">10</span>
                <span className="py-1">11</span>
                <span className="py-1 bg-earth-rose-light text-white rounded-full font-bold">12</span>
                <span className="py-1">13</span>
                <span className="py-1">14</span>
                <span className="py-1">15</span>
              </div>
              <div className="mt-4 flex gap-4 text-[10px] justify-center">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sage"></div> Available</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-earth-rose-light"></div> Booked</div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              {spaServices.slice(0, 3).map(service => (
                <motion.div
                  key={service.id}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  className="flex justify-between items-center p-3 rounded-xl border border-sage-dark/10 hover:border-sage-dark/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sage-dark">{service.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-charcoal">{service.name}</p>
                      <p className="text-[10px] text-surface-variant">{service.description}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sage-dark">${service.price}</p>
                </motion.div>
              ))}
            </div>

            <Link to="/spa">
              <motion.button whileHover={{ scale: 1.02 }} className="mt-6 w-full py-4 bg-sage-dark text-white font-bold rounded-full hover:shadow-lg transition-all">
                Book Appointment
              </motion.button>
            </Link>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
