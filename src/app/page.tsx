/**
 * Home Page / Lobby (Premium Design)
 * List of active matches with premium UI
 */

"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MatchCard from "@/components/MatchCard";
import Sidebar from "@/components/Sidebar";
import EntranceLoader from "@/components/EntranceLoader";
import GameCategory from "@/components/GameCategory";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import type { Match, ApiResponse } from "@/types";
import { Menu, Play, TrendingUp } from "lucide-react";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-load demo matches on first load if no matches exist
  useEffect(() => {
    if (!loading && matches.length === 0) {
      handleSeedDemo();
    }
  }, [loading]);

  const loadMatches = async () => {
    try {
      const res = await fetch("/api/matches/list");
      const data: ApiResponse<Match[]> = await res.json();
      if (data.success && data.data) {
        setMatches(data.data);
      }
    } catch (error) {
      console.error("Failed to load matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1: publicKey.toBase58(),
          metadata: {
            title: "Tic-Tac-Toe Match",
            description: "New match - join and bet!",
          },
        }),
      });

      const data: ApiResponse<Match> = await res.json();
      if (data.success && data.data) {
        router.push(`/match/${data.data.matchId}`);
      } else {
        alert(`Failed to create match: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSeedDemo = async () => {
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data: ApiResponse<{ matchId: string }> = await res.json();
      if (data.success && data.data) {
        alert("🎲 Demo match created! Check the lobby!");
        loadMatches();
      } else {
        alert(`Failed to seed demo: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const activeMatches = matches.filter((m) => m.status === "LIVE");
  const waitingMatches = matches.filter((m) => m.status === "PENDING");

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <AnimatePresence>
        {!entered && <EntranceLoader onComplete={() => setEntered(true)} />}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Layout - Pushed by Sidebar on Desktop */}
      <motion.div
        className={`transition-all duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        } lg:pl-64`}
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

        {/* Wallet Button - Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <WalletMultiButton />
        </div>

        {/* Content Wrapper */}
        <div className="relative">
          <main className="pb-20 pt-20 lg:pt-24">
            {/* Platform Hero Banner */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto mb-16">
              <div className="bg-gradient-to-r from-primary/20 via-dark-800 to-dark-800 rounded-3xl overflow-hidden border border-white/5 relative min-h-[400px] flex items-center">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>

                <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-4"
                  >
                    LIVE ON SOLANA DEVNET
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                    className="text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight"
                  >
                    Plexo <br />
                    <span className="text-transparent bg-clip-text bg-gradient-text">
                      GameFi Platform
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7 }}
                    className="text-gray-300 text-lg mb-8 max-w-md"
                  >
                    Play tic-tac-toe, spectate live matches, and place
                    predictions on outcomes. Powered by Solana for instant
                    settlements.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="flex gap-4"
                  >
                    <Button
                      size="xl"
                      icon={<Play className="w-6 h-6 fill-current" />}
                      onClick={handleCreateMatch}
                      disabled={!publicKey}
                    >
                      Create Match
                    </Button>
                    <Button
                      variant="secondary"
                      size="xl"
                      onClick={handleSeedDemo}
                    >
                      Load Demo Match
                    </Button>
                  </motion.div>
                </div>

                {/* Hero Visual Right Side */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pr-12">
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Game%20Die.png"
                    alt="Game"
                    className="w-80 h-80 drop-shadow-[0_0_60px_rgba(107,70,255,0.3)] animate-float"
                  />
                </div>
              </div>
            </div>

            {/* Game Categories */}
            <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-[1600px] mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Browse Games
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
                    {activeMatches.length} Live Now
                  </div>
                  <h2 className="text-3xl font-display font-bold">
                    Active Matches
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                    All
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-transparent text-gray-400 text-sm font-medium hover:text-white transition-colors">
                    Waiting
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-gray-400 mt-4">Loading matches...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-16 bg-dark-800/30 rounded-3xl border border-white/5">
                  <p className="text-gray-400 mb-4">No matches available</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleSeedDemo} variant="primary">
                      Load Demo Matches
                    </Button>
                    <Button
                      onClick={handleCreateMatch}
                      disabled={!publicKey}
                      variant="outline"
                    >
                      Create First Match
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {matches.map((match) => (
                    <motion.div
                      key={match.matchId}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <MatchCard match={match} />
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </main>

          <div className="lg:pl-8">
            <Footer />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
