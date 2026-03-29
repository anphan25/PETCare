import { motion } from 'framer-motion';

/**
 * PageLoader – pure display component for history pages.
 * Caller is responsible for controlling visibility via useMinimumLoading.
 *
 * Props:
 *   label – small text below the dots (default: 'Loading your history')
 */
export default function PageLoader({ label = 'Loading your history' }) {
  const particles = [
    { color: 'bg-sage-dark',  size: 'w-3 h-3', r: -52, dur: 2.8, delay: 0 },
    { color: 'bg-earth-rose', size: 'w-2 h-2', r: -64, dur: 3.6, delay: 0.4 },
    { color: 'bg-[#F4A261]',  size: 'w-2 h-2', r: -42, dur: 2.4, delay: 0.7 },
    { color: 'bg-sage',       size: 'w-3 h-3', r: -58, dur: 3.2, delay: 0.2 },
    { color: 'bg-white',      size: 'w-2 h-2', r: -70, dur: 4.0, delay: 0.9 },
    { color: 'bg-earth-rose', size: 'w-2 h-2', r: -46, dur: 2.6, delay: 0.55 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-28"
    >
      {/* Logo + ripples + orbiting particles */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Ripple rings */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 2.8], opacity: [0, 0.3, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 rounded-full bg-sage/50"
          />
        ))}

        {/* Central logo */}
        <motion.div
          animate={{
            scale: [1, 1.07, 1],
            filter: [
              'drop-shadow(0 0 6px rgba(157,192,139,0.25))',
              'drop-shadow(0 0 28px rgba(157,192,139,0.75))',
              'drop-shadow(0 0 6px rgba(157,192,139,0.25))',
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-20"
        >
          <img
            src="/logo-transparent.png"
            alt="PETCare"
            className="w-[88px] h-auto object-contain"
          />
        </motion.div>

        {/* Orbiting particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-start justify-center"
            style={{ transform: `rotate(${i * (360 / particles.length)}deg)` }}
          >
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: p.delay }}
              className={`${p.size} ${p.color} rounded-full shadow-md`}
              style={{ marginTop: `${p.r}px`, filter: 'blur(0.8px)' }}
            />
          </motion.div>
        ))}
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-surface-variant/60">
        {label}
      </p>
    </motion.div>
  );
}
