/**
 * In-memory data store for Plexo backend
 *
 * This store manages matches, moves, and bets in memory.
 * For production, replace with Prisma + PostgreSQL or Supabase.
 */

import { v4 as uuidv4 } from "uuid";
import type {
  Match,
  Move,
  Bet,
  MatchStatus,
  PlayerSide,
  GameResult,
} from "@/types";

class InMemoryStore {
  private matches: Map<string, Match> = new Map();
  private bets: Map<string, Bet> = new Map();

  // ============================================================================
  // Match Operations
  // ============================================================================

  createMatch(data: {
    player1: string;
    player2?: string | null;
    metadata?: any;
    matchPubkey?: string;
  }): Match {
    const matchId = uuidv4();
    const match: Match = {
      matchId,
      matchPubkey: data.matchPubkey,
      player1: data.player1,
      player2: data.player2 || null,
      status: "PENDING",
      moves: [],
      poolPlayer1: 0,
      poolPlayer2: 0,
      totalPool: 0,
      createdAt: Date.now(),
      metadata: data.metadata,
    };

    this.matches.set(matchId, match);
    return match;
  }

  getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId);
  }

  getMatchByPubkey(matchPubkey: string): Match | undefined {
    return Array.from(this.matches.values()).find(
      (m) => m.matchPubkey === matchPubkey
    );
  }

  getAllMatches(): Match[] {
    return Array.from(this.matches.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  updateMatch(matchId: string, updates: Partial<Match>): Match | null {
    const match = this.matches.get(matchId);
    if (!match) return null;

    const updated = { ...match, ...updates };
    this.matches.set(matchId, updated);
    return updated;
  }

  joinMatch(matchId: string, player2: string): Match | null {
    const match = this.matches.get(matchId);
    if (!match) return null;
    if (match.status !== "PENDING") return null;

    match.player2 = player2;
    match.status = "LIVE";
    match.lockTime = Math.floor(Date.now() / 1000) + 300; // 5 minutes

    return match;
  }

  deleteMatch(matchId: string): boolean {
    return this.matches.delete(matchId);
  }

  // ============================================================================
  // Move Operations
  // ============================================================================

  addMove(
    matchId: string,
    move: Omit<Move, "moveIndex" | "timestamp">
  ): Move | null {
    const match = this.matches.get(matchId);
    if (!match) return null;

    const newMove: Move = {
      ...move,
      moveIndex: match.moves.length,
      timestamp: Date.now(),
    };

    match.moves.push(newMove);
    return newMove;
  }

  getMoves(matchId: string): Move[] {
    const match = this.matches.get(matchId);
    return match ? match.moves : [];
  }

  // ============================================================================
  // Bet Operations
  // ============================================================================

  createBet(data: {
    matchId: string;
    wallet: string;
    prediction: PlayerSide;
    amountLamports: number;
    txSignature?: string;
  }): Bet {
    const betId = uuidv4();
    const bet: Bet = {
      betId,
      matchId: data.matchId,
      wallet: data.wallet,
      prediction: data.prediction,
      amountLamports: data.amountLamports,
      timestamp: Date.now(),
      claimed: false,
      txSignature: data.txSignature,
    };

    this.bets.set(betId, bet);

    // Update match pools
    const match = this.matches.get(data.matchId);
    if (match) {
      if (data.prediction === "player1") {
        match.poolPlayer1 += data.amountLamports;
      } else {
        match.poolPlayer2 += data.amountLamports;
      }
      match.totalPool += data.amountLamports;
    }

    return bet;
  }

  getBet(betId: string): Bet | undefined {
    return this.bets.get(betId);
  }

  getBetsForMatch(matchId: string): Bet[] {
    return Array.from(this.bets.values()).filter((b) => b.matchId === matchId);
  }

  getBetsForWallet(wallet: string, matchId?: string): Bet[] {
    return Array.from(this.bets.values()).filter(
      (b) => b.wallet === wallet && (!matchId || b.matchId === matchId)
    );
  }

  markBetClaimed(betId: string): Bet | null {
    const bet = this.bets.get(betId);
    if (!bet) return null;

    bet.claimed = true;
    return bet;
  }

  // ============================================================================
  // Result & Payout Operations
  // ============================================================================

  setMatchResult(matchId: string, winner: GameResult): Match | null {
    const match = this.matches.get(matchId);
    if (!match) return null;

    match.status = "FINISHED";
    match.winner = winner;

    return match;
  }

  // ============================================================================
  // Stats & Helpers
  // ============================================================================

  getMatchStats(matchId: string) {
    const match = this.matches.get(matchId);
    if (!match) return null;

    const bets = this.getBetsForMatch(matchId);
    const bettorCount = new Set(bets.map((b) => b.wallet)).size;

    return {
      totalBets: bets.length,
      bettorCount,
      poolPlayer1: match.poolPlayer1,
      poolPlayer2: match.poolPlayer2,
      totalPool: match.totalPool,
    };
  }

  // Clear all data (for testing)
  clear() {
    this.matches.clear();
    this.bets.clear();
  }
}

// Export singleton instance
export const store = new InMemoryStore();

// Helper to seed demo data
export function seedDemoData() {
  // Create a demo match
  const demoMatch = store.createMatch({
    player1: "Gn1abc...demo1",
    player2: "Fv2xyz...demo2",
    matchPubkey: "DEMO_MATCH_PUBKEY_123",
    metadata: {
      title: "Demo Championship Match",
      description: "Sample match for demonstration",
    },
  });

  store.updateMatch(demoMatch.matchId, {
    status: "LIVE",
    lockTime: Math.floor(Date.now() / 1000) + 600, // 10 minutes
  });

  // Add some demo bets
  store.createBet({
    matchId: demoMatch.matchId,
    wallet: "BetterA...111",
    prediction: "player1",
    amountLamports: 5_000_000_000, // 5 SOL
  });

  store.createBet({
    matchId: demoMatch.matchId,
    wallet: "BetterB...222",
    prediction: "player2",
    amountLamports: 2_000_000_000, // 2 SOL
  });

  store.createBet({
    matchId: demoMatch.matchId,
    wallet: "BetterC...333",
    prediction: "player1",
    amountLamports: 3_000_000_000, // 3 SOL
  });

  // Add some moves
  store.addMove(demoMatch.matchId, { player: "player1", position: 4 }); // Center
  store.addMove(demoMatch.matchId, { player: "player2", position: 0 }); // Top-left

  console.log("Demo data seeded successfully");
  return demoMatch.matchId;
}
