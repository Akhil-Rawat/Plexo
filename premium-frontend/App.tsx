import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import MatchCard from './components/MatchCard';
import BettingPanel from './components/BettingPanel';
import EntranceLoader from './components/EntranceLoader';
import Sidebar from './components/Sidebar';
import GameCategory from './components/GameCategory';
import { MOCK_MATCHES, fadeUp, staggerContainer } from './constants';
import { ArrowRight, Activity, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [entered, setEntered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <AnimatePresence>
        {!entered && <EntranceLoader onComplete={() => setEntered(true)} />}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Layout - Pushed by Sidebar on Desktop */}
      <motion.div 
        className={`transition-all duration-300 ${entered ? 'opacity-100' : 'opacity-0'} lg:pl-64`}
        initial={false}
      >
        {/* Mobile Header Trigger */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-dark-800/80 backdrop-blur border border-white/10 rounded-lg text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="relative">
          {/* Simplified Navbar for App View - hidden logic inside standard navbar if needed, or overlay */}
          <div className="hidden lg:block">
             <Navbar />
          </div>

          <main className="pb-20">
            {/* Platform Hero Banner */}
            <div className="pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
              <div className="bg-gradient-to-r from-primary/20 via-dark-800 to-dark-800 rounded-3xl overflow-hidden border border-white/5 relative min-h-[400px] flex items-center">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                 <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
                 
                 <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }} // Wait for entrance
                      className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-4"
                    >
                      NEW SEASON LIVE
                    </motion.div>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight"
                    >
                      Plexo <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-text">World Series</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="text-gray-300 text-lg mb-8 max-w-md"
                    >
                       The biggest algorithmic trading tournament is here. $1M Prize Pool. Zero Fees.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-dark-900 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                    >
                      Join Now
                    </motion.button>
                 </div>

                 {/* Hero Visual Right Side */}
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pr-12">
                    <img 
                      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Trophy.png"
                      alt="Trophy"
                      className="w-80 h-80 drop-shadow-[0_0_60px_rgba(255,215,0,0.3)] animate-float"
                    />
                 </div>
              </div>
            </div>

            {/* Game Categories */}
            <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-[1600px] mx-auto">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                   <div className="w-1 h-6 bg-primary rounded-full"></div>
                   Game Lobby
                 </h2>
               </div>
               <GameCategory />
            </div>

            {/* Live Markets Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-red-500 font-bold mb-2 uppercase tracking-wider text-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Live Now
                    </div>
                    <h2 className="text-3xl font-display font-bold">Active Markets</h2>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">All</button>
                     <button className="px-4 py-2 rounded-lg bg-transparent text-gray-400 text-sm font-medium hover:text-white transition-colors">High Rollers</button>
                     <button className="px-4 py-2 rounded-lg bg-transparent text-gray-400 text-sm font-medium hover:text-white transition-colors">Ending Soon</button>
                  </div>
                </div>

                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {MOCK_MATCHES.map((match) => (
                    <motion.div key={match.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      <MatchCard match={match} />
                    </motion.div>
                  ))}
                  {/* Duplicate matches to fill grid for demo */}
                  {MOCK_MATCHES.map((match) => (
                    <motion.div key={match.id + '_dup'} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      <MatchCard match={{...match, id: match.id + '_dup'}} />
                    </motion.div>
                  ))}
                </div>
            </section>

            {/* Quick Bet Demo Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative overflow-hidden mt-12 rounded-3xl bg-dark-800/30 border border-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h2 className="text-4xl font-display font-bold">Instant Execution</h2>
                    <p className="text-gray-400 text-lg">
                      Place bets on active games with our high-performance order book. Experience zero latency and instant settlements directly to your wallet.
                    </p>
                    <div className="flex gap-4">
                       <div className="bg-dark-900 p-4 rounded-xl border border-white/5 flex-1">
                          <div className="text-2xl font-bold text-accent">0.05s</div>
                          <div className="text-sm text-gray-500">Latency</div>
                       </div>
                       <div className="bg-dark-900 p-4 rounded-xl border border-white/5 flex-1">
                          <div className="text-2xl font-bold text-primary">100%</div>
                          <div className="text-sm text-gray-500">On-Chain</div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-dark-900 p-8 rounded-2xl border border-white/5 shadow-2xl">
                    <BettingPanel />
                 </div>
              </div>
            </section>

          </main>
          
          <div className="lg:pl-8">
             <Footer />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
