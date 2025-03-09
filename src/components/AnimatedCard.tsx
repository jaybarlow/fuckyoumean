import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCardProps } from '@/types/components';

export default function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
    >
      {children}
    </motion.div>
  );
} 