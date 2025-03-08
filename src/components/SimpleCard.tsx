import { ReactNode } from 'react';

interface SimpleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export default function SimpleCard({ title, description, icon }: SimpleCardProps) {
  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="text-purple-400 mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-purple-500/10">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
} 