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
  const matchIds: string[] = [];

  // Match 1: High stakes championship
  const match1 = store.createMatch({
    player1: "CyberNinja",
    player2: "NeonStriker",
    matchPubkey: "DEMO_MATCH_1",
    metadata: {
      title: "🏆 Championship Finals",
      description: "High stakes showdown!",
    },
  });
  store.updateMatch(match1.matchId, {
    status: "LIVE",
    lockTime: Math.floor(Date.now() / 1000) + 3600,
  });
  // X | O | -
  // - | X | -
  // O | - | X
  store.addMove(match1.matchId, { player: "player1", position: 4 });
  store.addMove(match1.matchId, { player: "player2", position: 1 });
  store.addMove(match1.matchId, { player: "player1", position: 0 });
  store.addMove(match1.matchId, { player: "player2", position: 6 });
  store.addMove(match1.matchId, { player: "player1", position: 8 });
  store.createBet({ matchId: match1.matchId, wallet: "Whale1...AAA", prediction: "player1", amountLamports: 8_000_000_000 });
  store.createBet({ matchId: match1.matchId, wallet: "Whale2...BBB", prediction: "player2", amountLamports: 4_000_000_000 });
  store.createBet({ matchId: match1.matchId, wallet: "Trader...CCC", prediction: "player1", amountLamports: 2_450_000_000 });
  matchIds.push(match1.matchId);

  // Match 2: Scheduled match (betting open, not started)
  const match2 = store.createMatch({
    player1: "AlphaZero",
    player2: "DeepMind",
    matchPubkey: "DEMO_MATCH_2",
    metadata: {
      title: "🎮 AI Showdown",
      description: "Battle of algorithms",
    },
  });
  store.updateMatch(match2.matchId, {
    status: "LIVE",
    lockTime: Math.floor(Date.now() / 1000) + 7200,
  });
  store.addMove(match2.matchId, { player: "player1", position: 4 });
  store.createBet({ matchId: match2.matchId, wallet: "Bot1...DDD", prediction: "player1", amountLamports: 5_000_000_000 });
  matchIds.push(match2.matchId);

  // Match 3: Intense mid-game
  const match3 = store.createMatch({
    player1: "PixelMaster",
    player2: "VoxelQueen",
    matchPubkey: "DEMO_MATCH_3",
    metadata: {
      title: "🔥 Ranked Battle",
      description: "Competitive ranked match",
    },
  });
  store.updateMatch(match3.matchId, {
    status: "LIVE",
    lockTime: Math.floor(Date.now() / 1000) + 1800,
  });
  // O | - | O
  // X | X | -
  // - | O | -
  store.addMove(match3.matchId, { player: "player2", position: 0 });
  store.addMove(match3.matchId, { player: "player1", position: 3 });
  store.addMove(match3.matchId, { player: "player2", position: 7 });
  store.addMove(match3.matchId, { player: "player1", position: 4 });
  store.addMove(match3.matchId, { player: "player2", position: 2 });
  store.createBet({ matchId: match3.matchId, wallet: "Pro1...EEE", prediction: "player2", amountLamports: 3_500_000_000 });
  store.createBet({ matchId: match3.matchId, wallet: "Pro2...FFF", prediction: "player1", amountLamports: 4_502_500_000 });
  matchIds.push(match3.matchId);

  // Match 4: Mega pool
  const match4 = store.createMatch({
    player1: "GrandMasterX",
    player2: "RookieKing",
    matchPubkey: "DEMO_MATCH_4",
    metadata: {
      title: "💎 High Rollers Only",
      description: "VIP exclusive match",
    },
  });
  store.updateMatch(match4.matchId, {
    status: "LIVE",
    lockTime: Math.floor(Date.now() / 1000) + 5400,
  });
  store.addMove(match4.matchId, { player: "player1", position: 4 });
  store.addMove(match4.matchId, { player: "player2", position: 0 });
  store.createBet({ matchId: match4.matchId, wallet: "Diamond...GGG", prediction: "player1", amountLamports: 12_500_000_000 });
  matchIds.push(match4.matchId);

  // Match 5: Quick match
  const match5 = store.createMatch({
    player1: "SpeedDemon",
    player2: "BlitzKing",
    matchPubkey: "DEMO_MATCH_5",
    metadata: {
      title: "⚡ Speed Chess",
      description: "Fast-paced action",
    },
  });
  store.updateMatch(match5.matchId, {
    status: "LIVE",
    lockTime: Math.floor(Date.now() / 1000) + 900,
  });
  // X | X | O
  // O | - | -
  // - | - | -
  store.addMove(match5.matchId, { player: "player1", position: 0 });
  store.addMove(match5.matchId, { player: "player2", position: 3 });
  store.addMove(match5.matchId, { player: "player1", position: 1 });
  store.addMove(match5.matchId, { player: "player2", position: 2 });
  store.createBet({ matchId: match5.matchId, wallet: "Speed1...HHH", prediction: "player1", amountLamports: 1_800_000_000 });
  store.createBet({ matchId: match5.matchId, wallet: "Speed2...III", prediction: "player2", amountLamports: 2_200_000_000 });
  store.createBet({ matchId: match5.matchId, wallet: "Speed3...JJJ", prediction: "player1", amountLamports: 1_500_000_000 });
  matchIds.push(match5.matchId);

  console.log(`🎲 Created ${matchIds.length} demo matches! Ready for betting!`);
  return matchIds[0]; // Return first match ID
}
