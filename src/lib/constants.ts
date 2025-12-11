import { PublicKey, clusterApiUrl } from "@solana/web3.js";

// Solana Configuration
export const SOLANA_NETWORK =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(SOLANA_NETWORK as any);

// Program ID - Replace with actual deployed program ID
export const PLEXO_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PLEXO_PROGRAM_ID || "11111111111111111111111111111111"
);

// Adapter mode: 'mock' or 'devnet'
export const ADAPTER_MODE = (process.env.NEXT_PUBLIC_ADAPTER_MODE || "mock") as
  | "mock"
  | "devnet";

// Game Configuration
export const BOARD_SIZE = 9; // 3x3 grid
export const WIN_PATTERNS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal \
  [2, 4, 6], // diagonal /
];

// Platform Configuration
export const PLATFORM_FEE_PERCENT = 2; // 2% platform fee
export const LAMPORTS_PER_SOL = 1_000_000_000;
export const MIN_BET_LAMPORTS = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL minimum
export const MAX_BET_LAMPORTS = 10 * LAMPORTS_PER_SOL; // 10 SOL maximum

// Timing
export const DEFAULT_LOCK_TIME_SECONDS = 300; // 5 minutes for betting
export const POLLING_INTERVAL_MS = 3000; // 3 seconds for match updates

// UI Constants
export const MATCH_STATUSES = {
  PENDING: {
    label: "Waiting for Player 2",
    color: "bg-yellow-100 text-yellow-800",
    badge: "bg-yellow-500",
  },
  LIVE: {
    label: "Game Live - Betting Open",
    color: "bg-green-100 text-green-800",
    badge: "bg-green-500",
  },
  BETTING_CLOSED: {
    label: "Betting Closed - Game in Progress",
    color: "bg-blue-100 text-blue-800",
    badge: "bg-blue-500",
  },
  FINISHED: {
    label: "Match Finished",
    color: "bg-gray-100 text-gray-800",
    badge: "bg-gray-500",
  },
  CANCELLED: {
    label: "Match Cancelled",
    color: "bg-red-100 text-red-800",
    badge: "bg-red-500",
  },
} as const;

// Mock data seed for deterministic demo
export const MOCK_SEED = 12345;
