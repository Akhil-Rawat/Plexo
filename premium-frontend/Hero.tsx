import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Play, TrendingUp, Zap } from 'lucide-react';
import { fadeUp, staggerContainer } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 px-4 sm:px-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-8 text-center lg:text-left z-10"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">Plexo Protocol V2.0 Live</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.1]">
            Predict. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-text">
              Win Big.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The world's first specialized prediction market for algorithmic skill games. Join thousands of spectators betting on real-time Tic-Tac-Toe battles.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="xl" icon={<Play className="w-6 h-6 fill-current" />}>
              Start Betting
            </Button>
            <Button variant="outline" size="xl">
              View Leaderboard
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={fadeUp} className="pt-8 border-t border-white/10 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">$4.2M+</div>
              <div className="text-sm text-gray-500">Total Volume</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">125K+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-white mb-1">~0.5s</div>
              <div className="text-sm text-gray-500">Latency</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Element */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Decorative floating elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -left-12 z-20"
          >
             <div className="bg-dark-800/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Live Payout</div>
                  <div className="font-bold text-white">+$1,240.50</div>
                </div>
             </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -right-8 z-20"
          >
             <div className="bg-dark-800/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Active Pool</div>
                  <div className="font-bold text-white">2,450 SOL</div>
                </div>
             </div>
          </motion.div>

          {/* Main Card */}
          <div className="relative bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-[32px]">
            <div className="bg-dark-900 rounded-[31px] overflow-hidden relative shadow-2xl shadow-primary/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              {/* Abstract App Interface Mockup */}
              <div className="p-8 space-y-6">
                 <div className="flex justify-between items-center mb-4">
                    <div className="h-3 w-20 bg-gray-700 rounded-full" />
                    <div className="h-8 w-24 bg-primary/20 rounded-lg" />
                 </div>
                 {/* Mock Game Board */}
                 <div className="aspect-square bg-dark-800 rounded-2xl border border-white/5 relative p-6">
                    <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full">
                       {[...Array(9)].map((_, i) => (
                         <div key={i} className="bg-white/5 rounded-lg flex items-center justify-center">
                            {i === 0 && <span className="text-5xl text-secondary font-bold">X</span>}
                            {i === 4 && <span className="text-5xl text-primary font-bold">O</span>}
                            {i === 2 && <span className="text-5xl text-secondary font-bold">X</span>}
                         </div>
                       ))}
                    </div>
                    {/* Winning line animation mockup */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-accent shadow-[0_0_10px_#00FF88] opacity-0 animate-[pulse_2s_infinite]" />
                 </div>
                 <div className="h-12 w-full bg-primary rounded-xl mt-4 opacity-90" />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
