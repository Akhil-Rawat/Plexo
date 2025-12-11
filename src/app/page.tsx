/**
 * Home Page / Lobby
 * List of active matches
 */

"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MatchCard from "@/components/MatchCard";
import type { Match, ApiResponse } from "@/types";

export default function Home() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 3000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Plexo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                GameFi Prediction Platform
              </p>
            </div>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Play. Watch. Predict. Win.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Real-time GameFi where players compete and spectators place bets on
            the outcome. All on Solana.
          </p>
          <motion.button
            onClick={handleCreateMatch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            🎮 Create New Match
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl font-bold text-primary-600">
              {matches.length}
            </div>
            <div className="text-sm text-gray-600 mt-2">Active Matches</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl font-bold text-purple-600">
              {matches.filter((m) => m.status === "LIVE").length}
            </div>
            <div className="text-sm text-gray-600 mt-2">Live Games</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl font-bold text-green-600">2%</div>
            <div className="text-sm text-gray-600 mt-2">Platform Fee</div>
          </motion.div>
        </div>

        {/* Matches List */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Active Matches
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No active matches yet
              </p>
              <button
                onClick={handleCreateMatch}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Create the first match →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container-custom py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Built on Solana • Devnet</p>
            <p className="mt-2">Plexo - Real-time GameFi Prediction Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
