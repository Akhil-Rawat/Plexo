import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  Wallet, 
  Settings, 
  HelpCircle,
  Menu,
  Dice5,
  TrendingUp,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const navItems = [
  { icon: Home, label: 'Lobby', active: true },
  { icon: Gamepad2, label: 'Live Games' },
  { icon: Dice5, label: 'Casino' },
  { icon: Trophy, label: 'Tournaments' },
  { icon: TrendingUp, label: 'Sports' },
];

const bottomItems = [
  { icon: Wallet, label: 'Vault' },
  { icon: HelpCircle, label: 'Support' },
  { icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
         className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={() => setIsOpen(false)}
      />

      <motion.aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-dark-900 border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold font-display text-xl shadow-[0_0_15px_rgba(107,70,255,0.5)]">
               P
             </div>
             <span className="font-display font-bold text-2xl tracking-tight text-white">Plexo</span>
          </div>
        </div>

        {/* Main Nav */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-2">Platform</div>
          {navItems.map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                item.active 
                  ? 'bg-gradient-to-r from-primary/10 to-transparent text-white border-l-2 border-primary' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-primary' : 'text-gray-500 group-hover:text-white'} transition-colors`} />
              <span className="font-medium">{item.label}</span>
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#6B46FF]" />}
            </button>
          ))}

          <div className="my-6 border-t border-white/5" />
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-2">Favorites</div>
          {['Tic-Tac-Toe', 'Speed Chess', 'Connect 4'].map((game, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors group">
              <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-white transition-colors" />
              <span className="text-sm">{game}</span>
              {i === 0 && <span className="ml-auto text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">LIVE</span>}
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-1 bg-dark-800/30">
          {bottomItems.map((item, idx) => (
             <button 
              key={idx}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
