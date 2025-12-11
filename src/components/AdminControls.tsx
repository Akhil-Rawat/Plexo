/**
 * AdminControls Component
 * Controls for match creator to manage match results
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { lamportsToSol, calculatePayout } from "@/lib/utils";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";
import type { Match, GameResult } from "@/types";

interface AdminControlsProps {
  match: Match;
  userWallet?: string;
  onSubmitResult: (winner: GameResult) => Promise<void>;
  onCancel?: () => Promise<void>;
}

export default function AdminControls({
  match,
  userWallet,
  onSubmitResult,
  onCancel,
}: AdminControlsProps) {
  const [selectedWinner, setSelectedWinner] = useState<GameResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isMatchCreator = userWallet === match.player1;

  if (!isMatchCreator) {
    return null;
  }

  if (match.status === "FINISHED" || match.status === "CANCELLED") {
    return (
      <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Match Complete</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <span className="text-sm font-semibold text-gray-900">
              {match.status === "FINISHED" ? "Finished" : "Cancelled"}
            </span>
          </div>
          {match.winner && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Winner:</span>
              <span className="text-sm font-semibold text-gray-900">
                {match.winner === "draw"
                  ? "Draw"
                  : match.winner === "player1"
                  ? "Player 1 (X)"
                  : "Player 2 (O)"}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Pool:</span>
            <span className="text-sm font-semibold text-gray-900">
              {lamportsToSol(match.totalPool)} SOL
            </span>
          </div>
          {match.winner && match.winner !== "draw" && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Platform Fee:</span>
              <span className="text-sm font-semibold text-gray-900">
                {lamportsToSol(
                  Math.floor(match.totalPool * (PLATFORM_FEE_PERCENT / 100))
                )}{" "}
                SOL
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!selectedWinner) return;

    setIsSubmitting(true);
    try {
      await onSubmitResult(selectedWinner);
      setShowConfirm(false);
      setSelectedWinner(null);
    } catch (error: any) {
      alert(`Failed to submit result: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
        <h3 className="text-lg font-bold text-gray-900">
          Match Creator Controls
        </h3>
      </div>

      {!showConfirm ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            As the match creator, you can submit the final result when the game
            is complete.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Winner
            </label>
            <div className="space-y-2">
              <motion.button
                onClick={() => setSelectedWinner("player1")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full p-3 rounded-xl border-2 transition-all text-left
                  ${
                    selectedWinner === "player1"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 bg-white hover:border-primary-300"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Player 1 Wins (X)</span>
                  <span className="text-xs text-gray-500">
                    Pool: {lamportsToSol(match.poolPlayer1)} SOL
                  </span>
                </div>
              </motion.button>

              <motion.button
                onClick={() => setSelectedWinner("player2")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full p-3 rounded-xl border-2 transition-all text-left
                  ${
                    selectedWinner === "player2"
                      ? "border-danger-500 bg-danger-50"
                      : "border-gray-300 bg-white hover:border-danger-300"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Player 2 Wins (O)</span>
                  <span className="text-xs text-gray-500">
                    Pool: {lamportsToSol(match.poolPlayer2)} SOL
                  </span>
                </div>
              </motion.button>

              <motion.button
                onClick={() => setSelectedWinner("draw")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full p-3 rounded-xl border-2 transition-all text-left
                  ${
                    selectedWinner === "draw"
                      ? "border-gray-500 bg-gray-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Draw</span>
                  <span className="text-xs text-gray-500">Refunds issued</span>
                </div>
              </motion.button>
            </div>
          </div>

          <motion.button
            onClick={() => setShowConfirm(true)}
            disabled={!selectedWinner}
            whileHover={selectedWinner ? { scale: 1.02 } : {}}
            whileTap={selectedWinner ? { scale: 0.98 } : {}}
            className={`
              w-full py-3 rounded-xl font-bold text-white
              transition-all shadow-lg
              ${
                selectedWinner
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            Submit Result
          </motion.button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel Match
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
            <p className="text-sm font-semibold text-yellow-900 mb-2">
              ⚠️ Confirm Result Submission
            </p>
            <p className="text-sm text-yellow-800">
              You are about to declare{" "}
              <span className="font-bold">
                {selectedWinner === "draw"
                  ? "a Draw"
                  : selectedWinner === "player1"
                  ? "Player 1 (X)"
                  : "Player 2 (O)"}
              </span>{" "}
              as the winner. This action cannot be undone.
            </p>
            {selectedWinner !== "draw" && (
              <p className="text-xs text-yellow-700 mt-2">
                Winners will be able to claim their payouts after confirmation.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setShowConfirm(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
