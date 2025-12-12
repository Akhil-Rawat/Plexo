import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EntranceLoaderProps {
  onComplete: () => void;
}

const EntranceLoader: React.FC<EntranceLoaderProps> = ({ onComplete }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 1;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-900 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={counter === 100 ? { opacity: 0, pointerEvents: "none" } : {}}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (counter === 100) onComplete();
      }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-dark-900 to-dark-900 opacity-50" />

      <div className="relative z-10 flex flex-col items-center">
         {/* Logo Construction */}
         <div className="relative w-24 h-24 mb-8">
            <motion.div 
               className="absolute inset-0 border-4 border-primary/30 rounded-2xl"
               animate={{ rotate: 180, scale: [0.8, 1.2, 1] }}
               transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
               className="absolute inset-2 border-4 border-secondary/30 rounded-xl"
               animate={{ rotate: -180, scale: [1, 0.8, 1.1] }}
               transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-4xl font-display font-bold text-white">P</span>
            </div>
         </div>

         {/* Counter */}
         <div className="overflow-hidden h-12">
            <motion.span 
              className="block text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {counter}%
            </motion.span>
         </div>
         
         {/* Loading Text */}
         <motion.div 
            className="mt-4 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
         >
            {["I", "N", "I", "T", "I", "A", "L", "I", "Z", "I", "N", "G", "..."].map((char, i) => (
               <motion.span
                  key={i}
                  className="text-xs text-gray-500 font-medium tracking-widest"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
               >
                  {char}
               </motion.span>
            ))}
         </motion.div>
      </div>

      {/* Curtain Reveal Effect */}
      <motion.div 
        className="absolute inset-0 bg-black"
        initial={{ scaleY: 0 }}
        animate={counter === 100 ? { scaleY: 1, transformOrigin: 'top' } : { scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div 
        className="absolute inset-0 bg-primary"
        initial={{ scaleY: 0 }}
        animate={counter === 100 ? { scaleY: 1, transformOrigin: 'top' } : { scaleY: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div 
        className="absolute inset-0 bg-dark-900"
        initial={{ scaleY: 0 }}
        animate={counter === 100 ? { scaleY: 1, transformOrigin: 'bottom' } : { scaleY: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
};

export default EntranceLoader;
