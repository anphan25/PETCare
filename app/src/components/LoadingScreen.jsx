import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center mesh-gradient overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-sage-dark opacity-10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-earth-rose opacity-10 rounded-full blur-[120px]" />

      <div className="relative">
        {/* Main Icon Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 text-sage-dark drop-shadow-2xl"
        >
          <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            pets
          </span>
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-x-0 inset-y-0 flex items-start justify-center"
            style={{ transform: `rotate(${i * 60}deg)` }}
          >
            <div className="w-3 h-3 bg-sage rounded-full mt-[-20px] shadow-lg shadow-sage/50" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-3xl font-black text-forest tracking-tight mb-2">Fetching Joy...</h2>
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
            className="w-2 h-2 rounded-full bg-sage-dark"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-sage-dark"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-sage-dark"
          />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-surface-variant opacity-60">
          Preparing the sanctuary for your companion
        </p>
      </motion.div>
    </motion.div>
  );
}
