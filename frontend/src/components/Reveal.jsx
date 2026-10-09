import { motion } from 'framer-motion';

// Bungkus konten agar muncul dengan animasi fade + slide saat di-scroll
// ke dalam viewport. Dipicu sekali saja (once).
export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
