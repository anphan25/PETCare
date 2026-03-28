import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { foodProducts } from '../data/products';

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Dashboard({ onAddToCart }) {
  // Grab a few top products to feature
  const topProducts = foodProducts.slice(0, 3);
  
  return (
    <div className="mesh-gradient min-h-screen relative text-charcoal selection:bg-sage/40 overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sage opacity-20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-earth-rose opacity-20 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative pt-24 sm:pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto z-10">
        
        {/* HERO SECTION */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32"
        >
          <div className="lg:w-1/2 space-y-6 sm:space-y-8 z-10">
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-white/40 px-4 py-2 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
              <span className="material-symbols-outlined text-sage-dark text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-sage-dark">Tokyo's Premier Pet Sanctuary</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-black text-forest leading-[1.1] tracking-tight">
              A World of <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sage-dark to-earth-rose">Luxury Care</span> <br/>
              For Your Pet
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-base sm:text-xl text-surface-variant leading-relaxed max-w-lg font-medium">
              From organic grooming to 5-star hotel suites and premium nutrition. Every detail is crafted for your companion's joy and wellbeing.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <Link to="/hotel">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-sage-dark text-white rounded-full font-bold shadow-lg shadow-sage-dark/30 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                  <span className="material-symbols-outlined">king_bed</span>
                  Book Hotel
                </button>
              </Link>
              <Link to="/spa">
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/40 backdrop-blur-md text-sage-dark rounded-full font-bold border border-white/50 hover:bg-white/60 active:scale-95 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">spa</span>
                  Book Spa
                </button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div variants={fadeInUp} className="lg:w-1/2 relative w-full mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-linear-to-tr from-sage to-earth-rose opacity-20 blur-3xl rounded-full" />
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl sm:rounded-[3rem] overflow-hidden border-[6px] border-white/40 shadow-2xl"
            >
              {/* PLACEHOLDER IMAGE FOR HERO */}
              <img src="https://petuniverse.com/wp-content/uploads/2024/08/slider-10.jpg" alt="Happy Pet in Luxury Theme" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-forest/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 glass-panel p-4 rounded-2xl flex items-center justify-between border border-white/30 text-white backdrop-blur-xl">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                     <span className="material-symbols-outlined text-sm sm:text-base">favorite</span>
                   </div>
                   <div>
                     <p className="font-bold text-xs sm:text-sm">Trusted by</p>
                     <p className="text-[10px] sm:text-xs opacity-90 font-medium">10,000+ Pet Parents</p>
                   </div>
                 </div>

              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* SERVICES SHOWCASE (CSS Grid) */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32"
        >
          <div className="text-center mb-12 sm:mb-16">
            <motion.span variants={fadeInUp} className="text-sage-dark font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 block">Our Offerings</motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-5xl font-black text-forest mb-4">The Ultimate Sanctuary</motion.h2>
            <motion.p variants={fadeInUp} className="text-surface-variant text-base sm:text-lg max-w-2xl mx-auto">Comprehensive, 5-star experiences designed for every stage of your companion's life.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Products Card */}
            <motion.div variants={fadeInUp} className="group relative bg-forest rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-[350px] sm:h-[450px]">
              <div className="absolute inset-0">
                {/* PLACEHOLDER IMAGE FOR PRODUCTS */}
                <img src="PETFOOD3.jpg" alt="Products" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              </div>
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end">
                <span className="material-symbols-outlined text-sage-light text-3xl sm:text-4xl mb-3 sm:mb-4">storefront</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Boutique</h3>
                <p className="text-white/80 text-xs sm:text-sm mb-6">Curated organic food, treats, and premium life accessories.</p>
                <Link to="/products" className="inline-flex items-center gap-2 text-sage-light font-bold hover:gap-4 transition-all w-fit text-sm">
                  Shop Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </motion.div>

            {/* Spa Card */}
            <motion.div variants={fadeInUp} className="group relative bg-sage-dark rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-[350px] sm:h-[450px] md:translate-y-8">
              <div className="absolute inset-0">
                {/* PLACEHOLDER IMAGE FOR SPA */}
                <img src="dog-grooming.webp" alt="Spa" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              </div>
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end">
                <span className="material-symbols-outlined text-sage-light text-3xl sm:text-4xl mb-3 sm:mb-4">spa</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Spa & Grooming</h3>
                <p className="text-white/80 text-xs sm:text-sm mb-6">Relaxing baths, breed-specific styling, and wellness treatments.</p>
                <Link to="/spa" className="inline-flex items-center gap-2 text-sage-light font-bold hover:gap-4 transition-all w-fit text-sm">
                  Book Session <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </motion.div>

            {/* Hotel Card */}
            <motion.div variants={fadeInUp} className="group relative bg-earth-rose rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-[350px] sm:h-[450px]">
              <div className="absolute inset-0">
                {/* PLACEHOLDER IMAGE FOR HOTEL */}
                <img src="cat-hotel.jpg" alt="Hotel" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              </div>
              <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end">
                <span className="material-symbols-outlined text-sage-light text-3xl sm:text-4xl mb-3 sm:mb-4">king_bed</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Luxury Hotel</h3>
                <p className="text-white/80 text-xs sm:text-sm mb-6">Climate-controlled suites, 24/7 care, and gourmet room service.</p>
                <Link to="/hotel" className="inline-flex items-center gap-2 text-sage-light font-bold hover:gap-4 transition-all w-fit text-sm">
                  Reserve Suite <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* JAPAN STORE LOCATION BANNER */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col md:flex-row bg-charcoal"
        >
          <div className="md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10 md:order-1 order-2">
            <span className="inline-block w-fit px-3 py-1 bg-white/10 text-sage-light uppercase tracking-widest font-bold text-[10px] sm:text-xs rounded-full mb-4 sm:mb-6">Flagship Location</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">Visit Our Omotesando Sanctuary</h2>
            <p className="text-white/70 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Nestled in the heart of Tokyo's most stylish district, our flagship sanctuary offers a serene escape for pets and parents alike. Experience our services in person and consult with our world-class experts.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start sm:items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <span className="material-symbols-outlined text-sage-light text-[20px]">location_on</span>
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base">4-12-10 Jingumae</p>
                  <p className="text-white/60 text-xs sm:text-sm">Shibuya City, Tokyo 150-0001</p>
                </div>
              </div>
              <div className="flex items-start sm:items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <span className="material-symbols-outlined text-sage-light text-[20px]">schedule</span>
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base">Open Daily</p>
                  <p className="text-white/60 text-xs sm:text-sm">10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('4-12-10 Jingumae, Shibuya City, Tokyo 150-0001, Japan')}`, '_blank')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-charcoal rounded-full font-bold hover:bg-sage-light hover:text-forest transition-colors w-full sm:w-fit flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              Get Directions
            </button>
          </div>
          <div className="md:w-1/2 relative min-h-[300px] sm:min-h-[400px] md:order-2 order-1">
            {/* PLACEHOLDER STORE IMAGE */}
            <img src="https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/images/main.jpg" alt="Store Location Japan" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-b md:bg-linear-to-r from-charcoal via-charcoal/30 md:via-charcoal/70 to-transparent md:w-2/3 h-1/2 md:h-full opacity-90" />
            {/* Japan decorative element */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-charcoal/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white overflow-hidden flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#BC002D]"></div>
              </div>
              <span className="text-xs font-bold text-white tracking-widest">TOKYO</span>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
