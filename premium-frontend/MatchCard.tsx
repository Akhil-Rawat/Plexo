import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '../types';
import Card from './Card';
import { Users, Timer, Trophy } from 'lucide-react';
import GameBoard from './GameBoard';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const isLive = match.status === 'LIVE';

  return (
    <Card className="flex flex-col h-full" hoverEffect noPadding>
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-dark-700/30">
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
              <Timer className="w-3 h-3" />
              {match.startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <span className="text-xs text-gray-400 font-medium ml-2">Match #{match.id.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          {match.viewers.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Players */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={match.player1.avatar} alt={match.player1.name} className="w-16 h-16 rounded-full border-2 border-secondary object-cover" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary text-dark-900 rounded-full flex items-center justify-center font-bold text-xs shadow-lg">X</div>
            </div>
            <span className="font-bold text-white text-sm">{match.player1.name}</span>
            <span className="text-xs text-secondary">{match.player1.winRate}% WR</span>
          </div>
          
          <div className="text-center">
            <span className="text-2xl font-display font-bold text-white/20">VS</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={match.player2.avatar} alt={match.player2.name} className="w-16 h-16 rounded-full border-2 border-primary object-cover" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg">O</div>
            </div>
            <span className="font-bold text-white text-sm">{match.player2.name}</span>
            <span className="text-xs text-primary">{match.player2.winRate}% WR</span>
          </div>
        </div>

        {/* Mini Board (Preview) */}
        {isLive && (
          <div className="transform scale-75 -my-4 opacity-80 pointer-events-none">
            <GameBoard board={match.boardState} />
          </div>
        )}

        {/* Pool Info */}
        <div className="mt-auto">
           <div className="flex justify-between items-end mb-2">
             <span className="text-xs text-gray-400 uppercase tracking-wider">Pool Size</span>
             <span className="text-xl font-display font-bold text-white flex items-center gap-1">
               <span className="text-accent">$</span>
               {match.poolSize.toLocaleString()}
             </span>
           </div>
           <div className="w-full bg-dark-600 h-1.5 rounded-full overflow-hidden">
             <div className="bg-accent h-full w-[65%]" />
           </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
        >
          {isLive ? 'Join Prediction' : 'Set Reminder'}
        </motion.button>
      </div>
    </Card>
  );
};

export default MatchCard;
