/**
 * Onchain Adapter for Plexo Program
 *
 * This adapter provides a unified interface for interacting with the Solana program.
 * It supports two modes:
 * - 'mock': Simulates blockchain interactions for local development/demo
 * - 'devnet': Makes actual calls to the deployed Solana program on devnet
 *
 * Toggle mode via NEXT_PUBLIC_ADAPTER_MODE env variable
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { v4 as uuidv4 } from "uuid";
import {
  ADAPTER_MODE,
  PLEXO_PROGRAM_ID,
  SOLANA_RPC_ENDPOINT,
  PLATFORM_FEE_PERCENT,
} from "./constants";
import { calculatePayout } from "./utils";

// In-memory mock state
const mockState = {
  matches: new Map<string, MockMatch>(),
  bets: new Map<string, MockBet[]>(),
};

interface MockMatch {
  matchPubkey: string;
  player1: string;
  player2?: string;
  status: "PENDING" | "LIVE" | "FINISHED";
  poolPlayer1: number;
  poolPlayer2: number;
  totalPool: number;
  winner?: "player1" | "player2" | "draw";
  createdAt: number;
  lockTime?: number;
}

interface MockBet {
  wallet: string;
  prediction: "player1" | "player2";
  amount: number;
  claimed: boolean;
}

// ============================================================================
// Adapter Interface
// ============================================================================

export interface OnchainAdapter {
  createMatch(params: CreateMatchParams): Promise<CreateMatchResult>;
  joinMatch(params: JoinMatchParams): Promise<JoinMatchResult>;
  placeBet(params: PlaceBetParams): Promise<PlaceBetResult>;
  reportResult(params: ReportResultParams): Promise<ReportResultResult>;
  claimPayout(params: ClaimPayoutParams): Promise<ClaimPayoutResult>;
}

export interface CreateMatchParams {
  player1Pubkey: PublicKey;
  player2Pubkey?: PublicKey;
  metadata?: {
    title?: string;
    description?: string;
  };
  wallet?: any; // WalletContextState for signing
}

export interface CreateMatchResult {
  matchPubkey: string;
  txSignature?: string;
  success: boolean;
  error?: string;
}

export interface JoinMatchParams {
  matchPubkey: string;
  player2Pubkey: PublicKey;
  wallet?: any;
}

export interface JoinMatchResult {
  success: boolean;
  txSignature?: string;
  error?: string;
}

export interface PlaceBetParams {
  matchPubkey: string;
  bettorPubkey: PublicKey;
  prediction: "player1" | "player2";
  amountLamports: number;
  wallet?: any;
}

export interface PlaceBetResult {
  success: boolean;
  betId: string;
  txSignature?: string;
  error?: string;
}

export interface ReportResultParams {
  matchPubkey: string;
  winner: "player1" | "player2" | "draw";
  authorityPubkey: PublicKey;
  wallet?: any;
}

export interface ReportResultResult {
  success: boolean;
  txSignature?: string;
  error?: string;
}

export interface ClaimPayoutParams {
  matchPubkey: string;
  claimerPubkey: PublicKey;
  wallet?: any;
}

export interface ClaimPayoutResult {
  success: boolean;
  amountLamports: number;
  txSignature?: string;
  error?: string;
}

// ============================================================================
// Mock Adapter Implementation
// ============================================================================

class MockAdapter implements OnchainAdapter {
  private simulateLatency(): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500)
    );
  }

  async createMatch(params: CreateMatchParams): Promise<CreateMatchResult> {
    await this.simulateLatency();

    try {
      const matchPubkey = `MOCK_MATCH_${uuidv4().slice(0, 8)}`;

      const mockMatch: MockMatch = {
        matchPubkey,
        player1: params.player1Pubkey.toBase58(),
        player2: params.player2Pubkey?.toBase58(),
        status: "PENDING",
        poolPlayer1: 0,
        poolPlayer2: 0,
        totalPool: 0,
        createdAt: Date.now(),
        lockTime: Date.now() / 1000 + 300, // 5 minutes from now
      };

      mockState.matches.set(matchPubkey, mockMatch);
      mockState.bets.set(matchPubkey, []);

      return {
        matchPubkey,
        txSignature: `MOCK_TX_${uuidv4().slice(0, 16)}`,
        success: true,
      };
    } catch (error: any) {
      return {
        matchPubkey: "",
        success: false,
        error: error.message,
      };
    }
  }

  async joinMatch(params: JoinMatchParams): Promise<JoinMatchResult> {
    await this.simulateLatency();

    try {
      const match = mockState.matches.get(params.matchPubkey);

      if (!match) {
        throw new Error("Match not found");
      }

      if (match.status !== "PENDING") {
        throw new Error("Match already started");
      }

      match.player2 = params.player2Pubkey.toBase58();
      match.status = "LIVE";
      match.lockTime = Date.now() / 1000 + 300; // Reset lock time

      return {
        success: true,
        txSignature: `MOCK_TX_${uuidv4().slice(0, 16)}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async placeBet(params: PlaceBetParams): Promise<PlaceBetResult> {
    await this.simulateLatency();

    try {
      const match = mockState.matches.get(params.matchPubkey);

      if (!match) {
        throw new Error("Match not found");
      }

      if (match.status === "FINISHED") {
        throw new Error("Match already finished");
      }

      if (match.lockTime && Date.now() / 1000 > match.lockTime) {
        throw new Error("Betting period closed");
      }

      const betId = uuidv4();
      const bets = mockState.bets.get(params.matchPubkey) || [];

      bets.push({
        wallet: params.bettorPubkey.toBase58(),
        prediction: params.prediction,
        amount: params.amountLamports,
        claimed: false,
      });

      mockState.bets.set(params.matchPubkey, bets);

      // Update pools
      if (params.prediction === "player1") {
        match.poolPlayer1 += params.amountLamports;
      } else {
        match.poolPlayer2 += params.amountLamports;
      }
      match.totalPool += params.amountLamports;

      return {
        success: true,
        betId,
        txSignature: `MOCK_TX_${uuidv4().slice(0, 16)}`,
      };
    } catch (error: any) {
      return {
        success: false,
        betId: "",
        error: error.message,
      };
    }
  }

  async reportResult(params: ReportResultParams): Promise<ReportResultResult> {
    await this.simulateLatency();

    try {
      const match = mockState.matches.get(params.matchPubkey);

      if (!match) {
        throw new Error("Match not found");
      }

      if (match.status === "FINISHED") {
        throw new Error("Match already finished");
      }

      match.status = "FINISHED";
      match.winner = params.winner;

      return {
        success: true,
        txSignature: `MOCK_TX_${uuidv4().slice(0, 16)}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async claimPayout(params: ClaimPayoutParams): Promise<ClaimPayoutResult> {
    await this.simulateLatency();

    try {
      const match = mockState.matches.get(params.matchPubkey);

      if (!match) {
        throw new Error("Match not found");
      }

      if (match.status !== "FINISHED") {
        throw new Error("Match not finished yet");
      }

      if (!match.winner || match.winner === "draw") {
        throw new Error("No winner or draw - refunds handled separately");
      }

      const bets = mockState.bets.get(params.matchPubkey) || [];
      const userBet = bets.find(
        (b) => b.wallet === params.claimerPubkey.toBase58() && !b.claimed
      );

      if (!userBet) {
        throw new Error("No unclaimed bet found");
      }

      if (userBet.prediction !== match.winner) {
        throw new Error("Bet was on losing side");
      }

      const winningPool =
        match.winner === "player1" ? match.poolPlayer1 : match.poolPlayer2;
      const payout = calculatePayout(
        userBet.amount,
        winningPool,
        match.totalPool,
        PLATFORM_FEE_PERCENT
      );

      userBet.claimed = true;

      return {
        success: true,
        amountLamports: payout,
        txSignature: `MOCK_TX_${uuidv4().slice(0, 16)}`,
      };
    } catch (error: any) {
      return {
        success: false,
        amountLamports: 0,
        error: error.message,
      };
    }
  }

  // Helper to get mock match state (for debugging)
  getMatchState(matchPubkey: string) {
    return mockState.matches.get(matchPubkey);
  }

  getBets(matchPubkey: string) {
    return mockState.bets.get(matchPubkey) || [];
  }
}

// ============================================================================
// Devnet Adapter Implementation
// ============================================================================

class DevnetAdapter implements OnchainAdapter {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
  }

  async createMatch(params: CreateMatchParams): Promise<CreateMatchResult> {
    try {
      // TODO: Implement actual program call
      // 1. Derive Match PDA: [b"match", player1.key(), seed]
      // 2. Build instruction to call create_match on program
      // 3. Send and confirm transaction

      /* Example implementation:
      const [matchPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('match'),
          params.player1Pubkey.toBuffer(),
          // Add seed/counter
        ],
        PLEXO_PROGRAM_ID
      );

      const instruction = // Build program instruction
      
      const transaction = new Transaction().add(instruction);
      const signature = await params.wallet.sendTransaction(transaction, this.connection);
      await this.connection.confirmTransaction(signature);

      return {
        matchPubkey: matchPda.toBase58(),
        txSignature: signature,
        success: true,
      };
      */

      throw new Error(
        "Devnet adapter not yet implemented - deploy program first"
      );
    } catch (error: any) {
      return {
        matchPubkey: "",
        success: false,
        error: error.message,
      };
    }
  }

  async joinMatch(params: JoinMatchParams): Promise<JoinMatchResult> {
    try {
      // TODO: Implement join_match program call
      throw new Error(
        "Devnet adapter not yet implemented - deploy program first"
      );
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async placeBet(params: PlaceBetParams): Promise<PlaceBetResult> {
    try {
      // TODO: Implement place_bet program call
      // Transfer SOL from bettor to match escrow PDA
      throw new Error(
        "Devnet adapter not yet implemented - deploy program first"
      );
    } catch (error: any) {
      return {
        success: false,
        betId: "",
        error: error.message,
      };
    }
  }

  async reportResult(params: ReportResultParams): Promise<ReportResultResult> {
    try {
      // TODO: Implement report_result program call
      throw new Error(
        "Devnet adapter not yet implemented - deploy program first"
      );
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async claimPayout(params: ClaimPayoutParams): Promise<ClaimPayoutResult> {
    try {
      // TODO: Implement claim_payout program call
      throw new Error(
        "Devnet adapter not yet implemented - deploy program first"
      );
    } catch (error: any) {
      return {
        success: false,
        amountLamports: 0,
        error: error.message,
      };
    }
  }
}

// ============================================================================
// Export singleton adapter based on mode
// ============================================================================

export const onchainAdapter: OnchainAdapter =
  ADAPTER_MODE === "mock" ? new MockAdapter() : new DevnetAdapter();

// Export mock adapter for testing/debugging
export const mockAdapter = new MockAdapter();
