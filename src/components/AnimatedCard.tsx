import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export default function AnimatedCard({ title, description, icon, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
      }}
      className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
      <div className="relative z-10">
        <motion.div 
          className="text-purple-400 mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-purple-500/10"
          whileHover={{ rotate: 5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
} 