/**
 * BettingPanel Component (Premium Design)
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
import { MIN_BET_LAMPORTS, MAX_BET_LAMPORTS } from "@/lib/constants";
import type { Match, PlayerSide } from "@/types";
import Button from "./Button";
import { DollarSign, TrendingUp } from "lucide-react";

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
  const [betAmount, setBetAmount] = useState<number>(0.1);
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

    const amountLamports = solToLamports(betAmount);

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
      setBetAmount(0.1);
      setSelectedSide(null);
    } catch (error: any) {
      alert(`Failed to place bet: ${error.message}`);
    } finally {
      setIsPlacingBet(false);
    }
  };

  const potentialPayout = selectedSide
    ? betAmount * (selectedSide === "player1" ? oddsPlayer1 : oddsPlayer2)
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          Place Your Bet
        </h3>
        {isBettingClosed && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
            <p className="text-sm text-red-400 font-medium">
              Betting is closed
            </p>
          </div>
        )}
        {!userWallet && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-400 font-medium">
              Connect wallet to place bets
            </p>
          </div>
        )}
      </div>

      {/* Pool Stats */}
      <div className="bg-dark-700/50 rounded-xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Total Pool</span>
          <span className="text-lg font-bold text-white">
            {lamportsToSol(match.totalPool)} SOL
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500">P1 Pool</div>
            <div className="text-sm font-bold text-secondary">
              {lamportsToSol(match.poolPlayer1)} SOL
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="text-xs text-gray-500">P2 Pool</div>
            <div className="text-sm font-bold text-primary">
              {lamportsToSol(match.poolPlayer2)} SOL
            </div>
          </div>
        </div>
      </div>

      {/* Odds Selection */}
      <div className="grid grid-cols-2 gap-3">
        {/* Player 1 */}
        <motion.button
          onClick={() => !isBettingClosed && setSelectedSide("player1")}
          disabled={isBettingClosed}
          className={`
            relative flex flex-col items-center justify-center p-4 rounded-xl
            bg-dark-700/50 border-2 transition-all duration-200
            ${
              selectedSide === "player1"
                ? "border-secondary bg-white/5 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                : "border-white/5 hover:border-white/20"
            }
            ${
              isBettingClosed
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          `}
          whileHover={!isBettingClosed ? { y: -2 } : {}}
          whileTap={!isBettingClosed ? { scale: 0.98 } : {}}
        >
          <span className="text-xs text-gray-400 mb-1">Player 1 (X)</span>
          <span className="text-2xl font-display font-bold text-white">
            {oddsPlayer1.toFixed(2)}x
          </span>
          <span className="text-[10px] text-gray-500 mt-1">
            {formatWalletAddress(match.player1)}
          </span>
        </motion.button>

        {/* Player 2 */}
        <motion.button
          onClick={() =>
            !isBettingClosed && match.player2 && setSelectedSide("player2")
          }
          disabled={isBettingClosed || !match.player2}
          className={`
            relative flex flex-col items-center justify-center p-4 rounded-xl
            bg-dark-700/50 border-2 transition-all duration-200
            ${
              selectedSide === "player2"
                ? "border-primary bg-white/5 shadow-[0_0_15px_rgba(107,70,255,0.2)]"
                : "border-white/5 hover:border-white/20"
            }
            ${
              isBettingClosed || !match.player2
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          `}
          whileHover={!isBettingClosed && match.player2 ? { y: -2 } : {}}
          whileTap={!isBettingClosed && match.player2 ? { scale: 0.98 } : {}}
        >
          <span className="text-xs text-gray-400 mb-1">Player 2 (O)</span>
          <span className="text-2xl font-display font-bold text-white">
            {oddsPlayer2.toFixed(2)}x
          </span>
          <span className="text-[10px] text-gray-500 mt-1">
            {match.player2 ? formatWalletAddress(match.player2) : "Waiting..."}
          </span>
        </motion.button>
      </div>

      {/* Amount Slider */}
      {selectedSide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div>
            <div className="flex justify-between text-sm font-medium mb-3">
              <span className="text-gray-400">Wager Amount</span>
              <span className="text-white">{betAmount.toFixed(2)} SOL</span>
            </div>
            <div className="relative h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
                style={{
                  width: `${
                    (betAmount / Number(lamportsToSol(MAX_BET_LAMPORTS))) * 100
                  }%`,
                }}
              />
              <input
                type="range"
                min={lamportsToSol(MIN_BET_LAMPORTS)}
                max={lamportsToSol(MAX_BET_LAMPORTS)}
                step="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isPlacingBet}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{lamportsToSol(MIN_BET_LAMPORTS)} SOL</span>
              <span>{lamportsToSol(MAX_BET_LAMPORTS / 2)} SOL</span>
              <span>{lamportsToSol(MAX_BET_LAMPORTS)} SOL</span>
            </div>
          </div>

          {/* Potential Return */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-300">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span>Potential Payout</span>
            </div>
            <span className="text-2xl font-display font-bold text-accent">
              {potentialPayout.toFixed(2)} SOL
            </span>
          </div>

          {/* Place Bet Button */}
          <Button
            variant="primary"
            fullWidth
            size="lg"
            icon={<DollarSign className="w-5 h-5" />}
            disabled={!canPlaceBet || isPlacingBet}
            onClick={handlePlaceBet}
            className={
              !canPlaceBet || isPlacingBet
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          >
            {isPlacingBet ? "Placing..." : `Bet ${betAmount.toFixed(2)} SOL`}
          </Button>

          {/* Platform Fee */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-white/5">
            2% platform fee applies to all payouts
          </div>
        </motion.div>
      )}
    </div>
  );
}
