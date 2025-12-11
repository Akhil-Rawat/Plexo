/**
 * TicTacToeBoard Component
 * Interactive game board with move validation, win detection, and animations
 */

"use client";

import { motion } from "framer-motion";
import { getWinningPattern } from "@/lib/utils";
import type { Move, PlayerSide } from "@/types";

interface TicTacToeBoardProps {
  moves: Move[];
  onMakeMove?: (position: number) => void;
  currentPlayer: PlayerSide;
  disabled?: boolean;
  userSide?: PlayerSide; // Which side the current user is playing
}

export default function TicTacToeBoard({
  moves,
  onMakeMove,
  currentPlayer,
  disabled = false,
  userSide,
}: TicTacToeBoardProps) {
  // Build board state from moves
  const board: (PlayerSide | null)[] = Array(9).fill(null);
  moves.forEach((move) => {
    board[move.position] = move.player;
  });

  const winningPattern = getWinningPattern(moves);
  const isUserTurn = userSide === currentPlayer;

  const handleCellClick = (position: number) => {
    if (disabled || !onMakeMove || !isUserTurn) return;
    if (board[position] !== null) return;

    onMakeMove(position);
  };

  const getCellContent = (position: number) => {
    const player = board[position];
    if (!player) return null;

    return player === "player1" ? (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-6xl font-bold text-primary-600"
      >
        X
      </motion.div>
    ) : (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-6xl font-bold text-danger-500"
      >
        O
      </motion.div>
    );
  };

  const isCellWinning = (position: number) => {
    return winningPattern?.includes(position);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto aspect-square">
        {Array.from({ length: 9 }).map((_, index) => {
          const isWinning = isCellWinning(index);
          const isEmpty = board[index] === null;
          const canClick = !disabled && isEmpty && isUserTurn && onMakeMove;

          return (
            <motion.button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!canClick}
              whileHover={canClick ? { scale: 1.05 } : {}}
              whileTap={canClick ? { scale: 0.95 } : {}}
              className={`
                aspect-square rounded-2xl shadow-lg
                flex items-center justify-center
                transition-all duration-200
                ${
                  isWinning
                    ? "bg-green-100 border-4 border-green-500"
                    : "bg-white border-2 border-gray-200"
                }
                ${
                  canClick
                    ? "hover:bg-gray-50 cursor-pointer"
                    : "cursor-default"
                }
                ${!canClick && isEmpty ? "opacity-50" : ""}
              `}
            >
              {getCellContent(index)}
            </motion.button>
          );
        })}
      </div>

      {/* Turn indicator */}
      {!disabled && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isUserTurn ? (
              <span className="text-primary-600 font-semibold">Your turn!</span>
            ) : (
              <span>Waiting for opponent...</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
