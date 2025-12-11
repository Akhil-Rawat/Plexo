/**
 * BettingPanel Component
 * UI for placing bets on match outcomes
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  lamportsToSol,
  solToLamports,
  calculateOdds,
  formatWalletAddress,
} from "@/lib/utils";
import {
  MIN_BET_LAMPORTS,
  MAX_BET_LAMPORTS,
  LAMPORTS_PER_SOL,
} from "@/lib/constants";
import type { Match, PlayerSide } from "@/types";

interface BettingPanelProps {
  match: Match;
  userWallet?: string;
  onPlaceBet: (prediction: PlayerSide, amountLamports: number) => Promise<void>;
  disabled?: boolean;
}

export default function BettingPanel({
  match,
  userWallet,
  onPlaceBet,
  disabled = false,
}: BettingPanelProps) {
  const [selectedSide, setSelectedSide] = useState<PlayerSide | null>(null);
  const [betAmount, setBetAmount] = useState<string>("0.1");
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const { oddsPlayer1, oddsPlayer2 } = calculateOdds(
    match.poolPlayer1,
    match.poolPlayer2
  );

  const isBettingClosed =
    match.status === "FINISHED" ||
    match.status === "CANCELLED" ||
    Boolean(match.lockTime && Date.now() / 1000 > match.lockTime);

  const canPlaceBet =
    !disabled && !isBettingClosed && userWallet && selectedSide;

  const handlePlaceBet = async () => {
    if (!canPlaceBet || !selectedSide) return;

    const amountLamports = solToLamports(parseFloat(betAmount));

    if (
      amountLamports < MIN_BET_LAMPORTS ||
      amountLamports > MAX_BET_LAMPORTS
    ) {
      alert(
        `Bet must be between ${lamportsToSol(
          MIN_BET_LAMPORTS
        )} and ${lamportsToSol(MAX_BET_LAMPORTS)} SOL`
      );
      return;
    }

    setIsPlacingBet(true);
    try {
      await onPlaceBet(selectedSide, amountLamports);
      setBetAmount("0.1");
      setSelectedSide(null);
    } catch (error: any) {
      alert(`Failed to place bet: ${error.message}`);
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Place Your Bet</h3>

        {isBettingClosed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800 font-medium">
              Betting is closed
            </p>
          </div>
        )}

        {!userWallet && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 font-medium">
              Connect wallet to place bets
            </p>
          </div>
        )}
      </div>

      {/* Pool Stats */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Pool</span>
          <span className="font-bold text-gray-900">
            {lamportsToSol(match.totalPool)} SOL
          </span>
        </div>

        {/* Player 1 Pool */}
        <motion.button
          onClick={() => !isBettingClosed && setSelectedSide("player1")}
          disabled={isBettingClosed}
          whileHover={!isBettingClosed ? { scale: 1.02 } : {}}
          whileTap={!isBettingClosed ? { scale: 0.98 } : {}}
          className={`
            w-full p-4 rounded-xl border-2 transition-all
            ${
              selectedSide === "player1"
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 bg-gray-50 hover:border-primary-300"
            }
            ${
              isBettingClosed
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          `}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-900">Player 1 (X)</span>
            <span className="text-xs text-gray-500">
              {formatWalletAddress(match.player1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pool</span>
            <span className="font-bold text-primary-600">
              {lamportsToSol(match.poolPlayer1)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Odds</span>
            <span className="text-xs font-medium text-gray-700">
              {oddsPlayer1.toFixed(2)}x
            </span>
          </div>
        </motion.button>

        {/* Player 2 Pool */}
        <motion.button
          onClick={() =>
            !isBettingClosed && match.player2 && setSelectedSide("player2")
          }
          disabled={isBettingClosed || !match.player2}
          whileHover={!isBettingClosed && match.player2 ? { scale: 1.02 } : {}}
          whileTap={!isBettingClosed && match.player2 ? { scale: 0.98 } : {}}
          className={`
            w-full p-4 rounded-xl border-2 transition-all
            ${
              selectedSide === "player2"
                ? "border-danger-500 bg-danger-50"
                : "border-gray-200 bg-gray-50 hover:border-danger-300"
            }
            ${
              isBettingClosed || !match.player2
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          `}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-900">Player 2 (O)</span>
            <span className="text-xs text-gray-500">
              {match.player2
                ? formatWalletAddress(match.player2)
                : "Waiting..."}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pool</span>
            <span className="font-bold text-danger-500">
              {lamportsToSol(match.poolPlayer2)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Odds</span>
            <span className="text-xs font-medium text-gray-700">
              {oddsPlayer2.toFixed(2)}x
            </span>
          </div>
        </motion.button>
      </div>

      {/* Bet Amount Input */}
      {selectedSide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount (SOL)
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min={lamportsToSol(MIN_BET_LAMPORTS)}
              max={lamportsToSol(MAX_BET_LAMPORTS)}
              step="0.01"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-semibold"
              disabled={isPlacingBet}
            />
            <p className="text-xs text-gray-500 mt-1">
              Min: {lamportsToSol(MIN_BET_LAMPORTS)} SOL • Max:{" "}
              {lamportsToSol(MAX_BET_LAMPORTS)} SOL
            </p>
          </div>

          <motion.button
            onClick={handlePlaceBet}
            disabled={!canPlaceBet || isPlacingBet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-4 rounded-xl font-bold text-white text-lg
              transition-all shadow-lg
              ${
                canPlaceBet && !isPlacingBet
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isPlacingBet
              ? "Placing Bet..."
              : `Bet ${betAmount} SOL on ${
                  selectedSide === "player1" ? "Player 1" : "Player 2"
                }`}
          </motion.button>
        </motion.div>
      )}

      {/* Platform Fee Notice */}
      <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
        2% platform fee applies to all payouts
      </div>
    </div>
  );
}
