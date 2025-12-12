import React from 'react';
import { Twitter, Github, Disc } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold font-display text-xl">P</div>
               <span className="font-display font-bold text-2xl tracking-tight text-white">Plexo</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier destination for skill-based algorithmic prediction markets. Fair, transparent, and built for speed.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Disc className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Markets</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tournaments</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4">Subscribe for platform updates and market insights.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary w-full"
              />
              <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 border-t border-white/5 pt-8">
          © {new Date().getFullYear()} Plexo Protocol. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
