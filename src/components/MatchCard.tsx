/**
 * MatchCard Component
 * Display card for match in lobby/list view (Premium Design)
 */

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { lamportsToSol, formatWalletAddress } from "@/lib/utils";
import { MATCH_STATUSES } from "@/lib/constants";
import type { Match } from "@/types";
import Card from "./Card";
import { Users, Timer } from "lucide-react";
import GameBoard from "./GameBoard";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const router = useRouter();
  const statusConfig = MATCH_STATUSES[match.status];
  const isLive = match.status === "LIVE";

  const handleClick = () => {
    router.push(`/match/${match.matchId}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/match/${match.matchId}?action=join`);
  };

  return (
    <Card
      className="flex flex-col h-full cursor-pointer"
      hoverEffect
      noPadding
      onClick={handleClick}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-dark-700/30">
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE
            </span>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          )}
          <span className="text-xs text-gray-400 font-medium ml-2">
            Match #{match.matchId.slice(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>{Math.floor(Math.random() * 15000) + 500}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Title */}
        {match.metadata?.title && (
          <h3 className="text-lg font-bold text-white">
            {match.metadata.title}
          </h3>
        )}

        {/* Players */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary border-2 border-secondary flex items-center justify-center">
                <span className="text-xs font-mono text-secondary">
                  {formatWalletAddress(match.player1).slice(0, 4)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary text-dark-900 rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                X
              </div>
            </div>
            <span className="font-bold text-white text-sm">
              {match.player1}
            </span>
          </div>

          <div className="text-center">
            <span className="text-2xl font-display font-bold text-white/20">
              VS
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            {match.player2 ? (
              <>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-mono text-primary">
                      {formatWalletAddress(match.player2).slice(0, 4)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                    O
                  </div>
                </div>
                <span className="font-bold text-white text-sm">
                  {match.player2}
                </span>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white/40" />
                </div>
                <span className="text-sm text-gray-400 italic">Waiting...</span>
              </>
            )}
          </div>
        </div>

        {/* Pool Info */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Total Pool
            </span>
            <span className="text-xl font-display font-bold text-white flex items-center gap-1">
              <span className="text-accent">◎</span>
              {lamportsToSol(match.totalPool)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>
              <span className="text-gray-500">P1 Pool: </span>
              <span className="text-secondary font-bold">
                {lamportsToSol(match.poolPlayer1)} SOL
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-500">P2 Pool: </span>
              <span className="text-primary font-bold">
                {lamportsToSol(match.poolPlayer2)} SOL
              </span>
            </div>
          </div>
          <div className="w-full bg-dark-600 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all"
              style={{
                width: `${(match.poolPlayer1 / (match.totalPool || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        {!match.player2 && match.status === "PENDING" ? (
          <motion.button
            onClick={handleJoin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(107,70,255,0.5)] transition-all"
          >
            Join as Player 2
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            {isLive ? "Watch & Bet" : "View Details"}
          </motion.button>
        )}
      </div>
    </Card>
  );
}
