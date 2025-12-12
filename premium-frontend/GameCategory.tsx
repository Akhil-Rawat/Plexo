import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Swords, CircleDot, Dices, Trophy } from 'lucide-react';

const categories = [
  { id: 'ttt', name: 'Tic-Tac-Toe', count: 124, icon: Grid3X3, color: 'from-blue-500 to-indigo-600' },
  { id: 'chess', name: 'Speed Chess', count: 42, icon: Swords, color: 'from-purple-500 to-pink-600' },
  { id: 'c4', name: 'Connect 4', count: 18, icon: CircleDot, color: 'from-orange-400 to-red-500' },
  { id: 'random', name: 'RNG Battles', count: 56, icon: Dices, color: 'from-emerald-400 to-green-600' },
  { id: 'tourney', name: 'Tournaments', count: 3, icon: Trophy, color: 'from-yellow-400 to-amber-600' },
];

const GameCategory: React.FC = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x">
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex-shrink-0 w-40 h-48 rounded-2xl overflow-hidden group snap-start"
        >
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          
          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between text-left">
            <div className="bg-white/20 w-fit p-2 rounded-lg backdrop-blur-md">
              <cat.icon className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <div className="text-xs font-medium text-white/80 mb-1">{cat.count} Live</div>
              <div className="font-display font-bold text-xl text-white leading-tight">{cat.name}</div>
            </div>
          </div>
          
          {/* Decoration */}
          <cat.icon className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </motion.button>
      ))}
    </div>
  );
};

export default GameCategory;
