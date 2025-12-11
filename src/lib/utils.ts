import { WIN_PATTERNS, BOARD_SIZE } from "./constants";
import type { Move, GameResult, PlayerSide } from "@/types";

/**
 * Check if a player has won the game
 */
export function checkWinner(moves: Move[]): GameResult | null {
  // Build board state from moves
  const board: (PlayerSide | null)[] = Array(BOARD_SIZE).fill(null);

  moves.forEach((move) => {
    board[move.position] = move.player;
  });

  // Check all win patterns
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as GameResult;
    }
  }

  // Check for draw (all positions filled)
  if (moves.length === BOARD_SIZE) {
    return "draw";
  }

  return null;
}

/**
 * Get winning pattern positions if game is won
 */
export function getWinningPattern(moves: Move[]): number[] | null {
  const board: (PlayerSide | null)[] = Array(BOARD_SIZE).fill(null);

  moves.forEach((move) => {
    board[move.position] = move.player;
  });

  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return pattern;
    }
  }

  return null;
}

/**
 * Validate if a move is legal
 */
export function isValidMove(
  moves: Move[],
  position: number,
  expectedPlayer: PlayerSide
): boolean {
  // Check position is within bounds
  if (position < 0 || position >= BOARD_SIZE) {
    return false;
  }

  // Check position is not already occupied
  if (moves.some((m) => m.position === position)) {
    return false;
  }

  // Check it's the correct player's turn
  const lastMove = moves[moves.length - 1];
  if (lastMove && lastMove.player === expectedPlayer) {
    return false; // Same player can't move twice in a row
  }

  // Check game is not already finished
  if (checkWinner(moves)) {
    return false;
  }

  return true;
}

/**
 * Get the current player's turn
 */
export function getCurrentTurn(
  moves: Move[],
  startingPlayer: PlayerSide = "player1"
): PlayerSide {
  if (moves.length === 0) {
    return startingPlayer;
  }

  const lastMove = moves[moves.length - 1];
  return lastMove.player === "player1" ? "player2" : "player1";
}

/**
 * Calculate payout for a winning bettor
 */
export function calculatePayout(
  betAmount: number,
  winningPool: number,
  totalPool: number,
  platformFeePercent: number
): number {
  if (winningPool === 0) {
    return betAmount; // Return original bet if only bettor
  }

  const platformFee = Math.floor(totalPool * (platformFeePercent / 100));
  const netPool = totalPool - platformFee;
  const userShare = betAmount / winningPool;
  const payout = Math.floor(netPool * userShare);

  return payout;
}

/**
 * Convert lamports to SOL for display
 */
export function lamportsToSol(lamports: number): string {
  return (lamports / 1_000_000_000).toFixed(4);
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}

/**
 * Calculate betting odds ratio
 */
export function calculateOdds(
  poolPlayer1: number,
  poolPlayer2: number
): {
  oddsPlayer1: number;
  oddsPlayer2: number;
} {
  const total = poolPlayer1 + poolPlayer2;

  if (total === 0) {
    return { oddsPlayer1: 1, oddsPlayer2: 1 };
  }

  return {
    oddsPlayer1: total / (poolPlayer1 || 1),
    oddsPlayer2: total / (poolPlayer2 || 1),
  };
}

/**
 * Format wallet address for display
 */
export function formatWalletAddress(
  address: string,
  chars: number = 4
): string {
  if (address.length <= chars * 2) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Get time remaining until lock
 */
export function getTimeRemaining(lockTime?: number): string {
  if (!lockTime) {
    return "No limit";
  }

  const now = Date.now() / 1000;
  const remaining = lockTime - now;

  if (remaining <= 0) {
    return "Betting closed";
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
