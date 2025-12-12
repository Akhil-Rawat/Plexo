import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Button from './Button';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
        ? 'bg-dark-900/80 backdrop-blur-xl border-white/10 py-4' 
        : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold font-display text-xl">
             P
           </div>
           <span className="font-display font-bold text-2xl tracking-tight text-white">Plexo</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Markets', 'Leaderboard', 'Docs', 'Community'].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-bold text-white hover:text-primary transition-colors">
            Log In
          </button>
          <Button size="sm">Connect Wallet</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-dark-900 border-b border-white/10 overflow-hidden"
        >
          <div className="p-4 flex flex-col gap-4">
            {['Markets', 'Leaderboard', 'Docs', 'Community'].map((item) => (
              <a key={item} href="#" className="text-lg font-medium text-gray-300 py-2 border-b border-white/5">
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Button fullWidth variant="secondary">Log In</Button>
              <Button fullWidth>Connect Wallet</Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
