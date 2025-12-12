import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { DollarSign, TrendingUp } from 'lucide-react';

const BettingPanel: React.FC = () => {
  const [selectedSide, setSelectedSide] = useState<'p1' | 'draw' | 'p2' | null>(null);
  const [amount, setAmount] = useState<number>(50);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Odds Selection */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'p1', label: 'Player X', odds: 1.85, color: 'border-secondary' },
          { id: 'draw', label: 'Draw', odds: 3.50, color: 'border-gray-500' },
          { id: 'p2', label: 'Player O', odds: 2.10, color: 'border-primary' }
        ].map((option) => (
          <motion.button
            key={option.id}
            onClick={() => setSelectedSide(option.id as any)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl
              bg-dark-700/50 border-2 transition-all duration-200
              ${selectedSide === option.id 
                ? `${option.color} bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.1)]` 
                : 'border-white/5 hover:border-white/20'
              }
            `}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm text-gray-400 mb-1">{option.label}</span>
            <span className="text-xl font-display font-bold text-white">{option.odds.toFixed(2)}x</span>
          </motion.button>
        ))}
      </div>

      {/* Amount Slider */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-400">Wager Amount</span>
          <span className="text-white">${amount.toFixed(2)}</span>
        </div>
        <div className="relative h-2 bg-dark-600 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${(amount / 500) * 100}%` }}
          />
          <input 
            type="range" 
            min="10" 
            max="500" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>$10</span>
          <span>$250</span>
          <span>$500</span>
        </div>
      </div>

      {/* Potential Return */}
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 text-gray-300">
          <TrendingUp className="w-5 h-5 text-accent" />
          <span>Potential Payout</span>
        </div>
        <span className="text-2xl font-display font-bold text-accent">
          ${selectedSide ? (amount * (selectedSide === 'draw' ? 3.5 : selectedSide === 'p1' ? 1.85 : 2.10)).toFixed(2) : '0.00'}
        </span>
      </div>

      {/* Place Bet Button */}
      <Button 
        variant="primary" 
        fullWidth 
        size="lg"
        icon={<DollarSign className="w-5 h-5" />}
        disabled={!selectedSide}
        className={!selectedSide ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Place Prediction
      </Button>
    </div>
  );
};

export default BettingPanel;
