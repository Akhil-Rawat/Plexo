import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameBoardProps {
  board: (string | null)[];
  onCellClick?: (index: number) => void;
  interactive?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  interactive = false,
}) => {
  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto p-4">
      {/* Grid Lines - constructed with divs for glow effects */}
      <div className="absolute inset-4 grid grid-cols-3 grid-rows-3 gap-2">
        {/* Render lines manually for better control over glow */}
        <div className="absolute top-1/3 left-0 w-full h-[2px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-full"></div>
        <div className="absolute top-2/3 left-0 w-full h-[2px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-full"></div>
        <div className="absolute left-1/3 top-0 h-full w-[2px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-full"></div>
        <div className="absolute left-2/3 top-0 h-full w-[2px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-full"></div>
      </div>

      {/* Cells */}
      <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 z-10">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-center 
              ${
                interactive
                  ? "cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
                  : ""
              }
            `}
            onClick={() => interactive && onCellClick && onCellClick(index)}
          >
            <AnimatePresence mode="wait">
              {cell === "X" && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 100 100"
                    className="drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]"
                  >
                    <line
                      x1="20"
                      y1="20"
                      x2="80"
                      y2="80"
                      stroke="#00D4FF"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="80"
                      y1="20"
                      x2="20"
                      y2="80"
                      stroke="#00D4FF"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              )}
              {cell === "O" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 100 100"
                    className="drop-shadow-[0_0_15px_rgba(107,70,255,0.8)]"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#6B46FF"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
