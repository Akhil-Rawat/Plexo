// Core type definitions for Plexo GameFi DApp

export type MatchStatus =
  | "PENDING"
  | "LIVE"
  | "BETTING_CLOSED"
  | "FINISHED"
  | "CANCELLED";

export type PlayerSide = "player1" | "player2";

export type GameResult = "player1" | "player2" | "draw";

export interface Match {
  matchId: string;
  matchPubkey?: string; // Onchain PDA address
  player1: string; // Wallet address
  player2?: string | null; // Wallet address
  status: MatchStatus;
  moves: Move[];
  poolPlayer1: number; // in lamports
  poolPlayer2: number; // in lamports
  totalPool: number; // in lamports
  lockTime?: number; // Unix timestamp
  createdAt: number; // Unix timestamp
  winner?: GameResult;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export interface Move {
  player: PlayerSide;
  position: number; // 0-8 for tic-tac-toe
  moveIndex: number;
  timestamp: number;
}

export interface Bet {
  betId: string;
  matchId: string;
  wallet: string;
  prediction: PlayerSide;
  amountLamports: number;
  timestamp: number;
  claimed: boolean;
  txSignature?: string;
}

export interface BetReceipt {
  betId: string;
  txSignature?: string;
  success: boolean;
  error?: string;
}

export interface PayoutResult {
  wallet: string;
  amountLamports: number;
  txSignature?: string;
  success: boolean;
  error?: string;
}

export interface PoolStats {
  poolPlayer1: number;
  poolPlayer2: number;
  totalPool: number;
  oddsPlayer1: number; // ratio
  oddsPlayer2: number; // ratio
  bettorCount: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Transaction status for UI
export type TxStatus = "idle" | "pending" | "confirming" | "success" | "error";

export interface Transaction {
  id: string;
  status: TxStatus;
  signature?: string;
  error?: string;
  message: string;
}
