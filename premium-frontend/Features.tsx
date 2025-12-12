import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Cpu, Award, Smartphone } from 'lucide-react';
import Card from './Card';
import { staggerContainer, fadeUp } from '../constants';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: "Real-Time Settlements",
    description: "Bets are settled instantly via smart contracts upon game completion. No waiting, no counterparty risk."
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Provably Fair",
    description: "Every move and outcome is verified on-chain. Complete transparency ensures the integrity of every match."
  },
  {
    icon: <Globe className="w-8 h-8 text-secondary" />,
    title: "Global Liquidity",
    description: "Participate in massive shared pools. Our AMM ensures there's always a counter-position for your predictions."
  },
  {
    icon: <Cpu className="w-8 h-8 text-red-400" />,
    title: "AI Analysis",
    description: "Get real-time probability insights powered by advanced AI engines to inform your betting strategy."
  },
  {
    icon: <Award className="w-8 h-8 text-accent" />,
    title: "Ranked Tournaments",
    description: "Climb the leaderboard in seasonal tournaments to win exclusive NFTs and revenue share tokens."
  },
  {
    icon: <Smartphone className="w-8 h-8 text-purple-400" />,
    title: "Mobile First",
    description: "Experience seamless betting on the go with our fully optimized, native-feeling mobile web application."
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-32 px-4 relative">
       {/* Section Header */}
       <div className="max-w-4xl mx-auto text-center mb-20">
         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Built for the <span className="text-transparent bg-clip-text bg-gradient-text">Pro Trader</span>
         </motion.h2>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="text-xl text-gray-400"
          >
            Plexo combines the thrill of gaming with the sophistication of financial markets.
         </motion.p>
       </div>

       {/* Grid */}
       <motion.div 
         variants={staggerContainer}
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-100px" }}
         className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
       >
         {features.map((feature, index) => (
           <motion.div key={index} variants={fadeUp}>
             <Card className="h-full hover:bg-white/[0.07] transition-colors group" hoverEffect>
               <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                 {feature.icon}
               </div>
               <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
               <p className="text-gray-400 leading-relaxed">
                 {feature.description}
               </p>
             </Card>
           </motion.div>
         ))}
       </motion.div>
    </section>
  );
};

export default Features;
