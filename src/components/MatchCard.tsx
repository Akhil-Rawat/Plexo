/**
 * MatchCard Component
 * Display card for match in lobby/list view
 */

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { lamportsToSol, formatWalletAddress } from "@/lib/utils";
import { MATCH_STATUSES } from "@/lib/constants";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const router = useRouter();
  const statusConfig = MATCH_STATUSES[match.status];

  const handleClick = () => {
    router.push(`/match/${match.matchId}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/match/${match.matchId}?action=join`);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {match.metadata?.title || "Tic-Tac-Toe Match"}
          </h3>
          {match.metadata?.description && (
            <p className="text-sm text-gray-600 mt-1">
              {match.metadata.description}
            </p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Players */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Player 1 (X):</span>
          <span className="text-sm font-mono font-semibold text-gray-900">
            {formatWalletAddress(match.player1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Player 2 (O):</span>
          <span className="text-sm font-mono font-semibold text-gray-900">
            {match.player2 ? (
              formatWalletAddress(match.player2)
            ) : (
              <span className="text-gray-400 italic">Waiting...</span>
            )}
          </span>
        </div>
      </div>

      {/* Pool Stats */}
      <div className="bg-gradient-to-r from-primary-50 to-danger-50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Total Pool
          </span>
          <span className="text-lg font-bold text-gray-900">
            {lamportsToSol(match.totalPool)} SOL
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-600">P1 Pool</div>
            <div className="text-sm font-bold text-primary-600">
              {lamportsToSol(match.poolPlayer1)} SOL
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-600">P2 Pool</div>
            <div className="text-sm font-bold text-danger-500">
              {lamportsToSol(match.poolPlayer2)} SOL
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {match.status === "PENDING" && !match.player2 && (
          <motion.button
            onClick={handleJoin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold py-2 px-4 rounded-lg hover:from-success-600 hover:to-success-700 transition-all"
          >
            Join Match
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-all"
        >
          {match.status === "PENDING" && !match.player2
            ? "View"
            : "Watch & Bet"}
        </motion.button>
      </div>

      {/* Match Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>{match.moves.length} moves</span>
        <span>Created {new Date(match.createdAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
