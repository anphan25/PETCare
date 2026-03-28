import { motion } from 'framer-motion';

// Configuration for floating particles with varying orbits and colors
const particles = [
  { color: 'bg-earth-rose', size: 'w-4 h-4', radius: -45, duration: 3, delay: 0 },
  { color: 'bg-sage', size: 'w-3 h-3', radius: -60, duration: 4, delay: 0.5 },
  { color: 'bg-[#F4A261]', size: 'w-2 h-2', radius: -35, duration: 2.5, delay: 0.2 }, // Champagne accent
  { color: 'bg-sage-dark', size: 'w-3 h-3', radius: -55, duration: 3.5, delay: 0.8 },
  { color: 'bg-earth-rose', size: 'w-2 h-2', radius: -70, duration: 4.5, delay: 0.1 },
  { color: 'bg-white', size: 'w-2 h-2', radius: -40, duration: 2.8, delay: 0.6 },
];

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#F9FBF9] overflow-hidden"
    >
      {/* 1. Animated Floating Background Decor (Dynamic Mesh Gradient) */}
      <motion.div 
        animate={{ x: [-20, 30, -20], y: [-30, 20, -30], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-sage/40 rounded-full blur-[100px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ x: [30, -20, 30], y: [20, -40, 20], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-earth-rose/30 rounded-full blur-[120px] mix-blend-multiply" 
      />
      <motion.div 
        animate={{ x: [-30, 20, -30], y: [40, -20, 40] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E9C46A]/20 rounded-full blur-[90px] mix-blend-multiply" 
      />

      <div className="relative flex items-center justify-center z-10 mt-[-50px]">
        
        {/* 2. Glowing Ripples (Smooth expansion) */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ripple-${i}`}
            animate={{
              scale: [1, 2.8], 
              opacity: [0, 0.4, 0], 
            }}
            transition={{
              duration: 3, 
              repeat: Infinity,
              delay: i * 0.7, 
              ease: [0.4, 0, 0.2, 1], 
              times: [0, 0.2, 1] 
            }}
            className="absolute inset-0 rounded-full bg-sage/60 shadow-[0_0_60px_rgba(157,192,139,0.3)] mix-blend-screen"
          />
        ))}

        {/* 3. Main Icon Animation with Heartbeat effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1], 
            rotate: [0, 5, -5, 0],
            filter: ["drop-shadow(0px 0px 8px rgba(157,192,139,0.3))", "drop-shadow(0px 0px 25px rgba(157,192,139,0.7))", "drop-shadow(0px 0px 8px rgba(157,192,139,0.3))"]
          }}
          transition={{
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-20 text-forest bg-white/40 backdrop-blur-md p-6 sm:p-7 rounded-full border border-white/50 shadow-2xl"
        >
          <span className="material-symbols-outlined text-[70px] sm:text-[90px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            pets
          </span>
        </motion.div>

        {/* 4. Magic Dust Particles (3D Orbits) */}
        {particles.map((particle, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{ rotate: 360 }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 flex items-start justify-center"
            style={{ transform: `rotate(${i * (360 / particles.length)}deg)` }}
          >
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: particle.delay }}
              className={`${particle.size} ${particle.color} rounded-full shadow-lg`}
              style={{ marginTop: `${particle.radius}px`, filter: 'blur(1px)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* 5. Typography Animation */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="mt-16 text-center z-10"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-forest tracking-tight mb-3">
          Preparing...
        </h2>
        
        {/* Mini progress indicator (Bouncing dots) */}
        <div className="flex items-center justify-center gap-2.5">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              animate={{ y: [0, -8, 0], backgroundColor: ['#9DC08B', '#40513B', '#9DC08B'] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              className="w-2.5 h-2.5 rounded-full bg-sage-dark shadow-sm"
            />
          ))}
        </div>
        
        <p className="mt-6 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-surface-variant/70">
          Curating the ultimate luxury
        </p>
      </motion.div>
    </motion.div>
  );
}