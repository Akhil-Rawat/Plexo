/**
 * Unit tests for game logic utilities
 */

import {
  checkWinner,
  isValidMove,
  getCurrentTurn,
  calculatePayout,
  getWinningPattern,
} from "../src/lib/utils";
import type { Move, PlayerSide } from "../src/types";

describe("Tic-Tac-Toe Game Logic", () => {
  describe("checkWinner", () => {
    it("should detect horizontal win for player1", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 3, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 1, moveIndex: 2, timestamp: 3 },
        { player: "player2", position: 4, moveIndex: 3, timestamp: 4 },
        { player: "player1", position: 2, moveIndex: 4, timestamp: 5 },
      ];
      expect(checkWinner(moves)).toBe("player1");
    });

    it("should detect vertical win for player2", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 1, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 3, moveIndex: 2, timestamp: 3 },
        { player: "player2", position: 4, moveIndex: 3, timestamp: 4 },
        { player: "player1", position: 6, moveIndex: 4, timestamp: 5 },
        { player: "player2", position: 7, moveIndex: 5, timestamp: 6 },
      ];
      expect(checkWinner(moves)).toBe("player2");
    });

    it("should detect diagonal win", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 1, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 4, moveIndex: 2, timestamp: 3 },
        { player: "player2", position: 2, moveIndex: 3, timestamp: 4 },
        { player: "player1", position: 8, moveIndex: 4, timestamp: 5 },
      ];
      expect(checkWinner(moves)).toBe("player1");
    });

    it("should detect draw when board is full", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 1, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 2, moveIndex: 2, timestamp: 3 },
        { player: "player2", position: 4, moveIndex: 3, timestamp: 4 },
        { player: "player1", position: 3, moveIndex: 4, timestamp: 5 },
        { player: "player2", position: 5, moveIndex: 5, timestamp: 6 },
        { player: "player1", position: 7, moveIndex: 6, timestamp: 7 },
        { player: "player2", position: 6, moveIndex: 7, timestamp: 8 },
        { player: "player1", position: 8, moveIndex: 8, timestamp: 9 },
      ];
      expect(checkWinner(moves)).toBe("draw");
    });

    it("should return null when game is ongoing", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 1, moveIndex: 1, timestamp: 2 },
      ];
      expect(checkWinner(moves)).toBeNull();
    });
  });

  describe("getWinningPattern", () => {
    it("should return winning pattern positions", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 3, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 1, moveIndex: 2, timestamp: 3 },
        { player: "player2", position: 4, moveIndex: 3, timestamp: 4 },
        { player: "player1", position: 2, moveIndex: 4, timestamp: 5 },
      ];
      expect(getWinningPattern(moves)).toEqual([0, 1, 2]);
    });

    it("should return null when no winner", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
      ];
      expect(getWinningPattern(moves)).toBeNull();
    });
  });

  describe("isValidMove", () => {
    it("should allow valid move", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
      ];
      expect(isValidMove(moves, 1, "player2")).toBe(true);
    });

    it("should reject move on occupied position", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
      ];
      expect(isValidMove(moves, 0, "player2")).toBe(false);
    });

    it("should reject same player moving twice", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
      ];
      expect(isValidMove(moves, 1, "player1")).toBe(false);
    });

    it("should reject move after game finished", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 3, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 1, moveIndex: 2, timestamp: 3 },
        { player: "player2", position: 4, moveIndex: 3, timestamp: 4 },
        { player: "player1", position: 2, moveIndex: 4, timestamp: 5 },
      ];
      expect(isValidMove(moves, 5, "player2")).toBe(false);
    });

    it("should reject out of bounds position", () => {
      const moves: Move[] = [];
      expect(isValidMove(moves, 9, "player1")).toBe(false);
      expect(isValidMove(moves, -1, "player1")).toBe(false);
    });
  });

  describe("getCurrentTurn", () => {
    it("should return player1 for first move", () => {
      expect(getCurrentTurn([])).toBe("player1");
    });

    it("should alternate turns correctly", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
      ];
      expect(getCurrentTurn(moves)).toBe("player2");
    });

    it("should handle multiple moves", () => {
      const moves: Move[] = [
        { player: "player1", position: 0, moveIndex: 0, timestamp: 1 },
        { player: "player2", position: 1, moveIndex: 1, timestamp: 2 },
        { player: "player1", position: 2, moveIndex: 2, timestamp: 3 },
      ];
      expect(getCurrentTurn(moves)).toBe("player2");
    });
  });

  describe("calculatePayout", () => {
    it("should calculate payout with platform fee", () => {
      const betAmount = 5_000_000_000; // 5 SOL
      const winningPool = 8_000_000_000; // 8 SOL
      const totalPool = 10_000_000_000; // 10 SOL
      const platformFee = 2; // 2%

      const payout = calculatePayout(
        betAmount,
        winningPool,
        totalPool,
        platformFee
      );

      // Net pool = 10 SOL - 0.2 SOL (2% fee) = 9.8 SOL
      // User share = 5/8 of 9.8 = 6.125 SOL
      expect(payout).toBe(6_125_000_000);
    });

    it("should return original bet if only bettor", () => {
      const betAmount = 1_000_000_000; // 1 SOL
      const winningPool = 0;
      const totalPool = 1_000_000_000;
      const platformFee = 2;

      const payout = calculatePayout(
        betAmount,
        winningPool,
        totalPool,
        platformFee
      );
      expect(payout).toBe(betAmount);
    });

    it("should handle multiple bettors correctly", () => {
      const betAmount = 3_000_000_000; // 3 SOL
      const winningPool = 8_000_000_000; // 8 SOL (5 + 3)
      const totalPool = 10_000_000_000; // 10 SOL
      const platformFee = 2;

      const payout = calculatePayout(
        betAmount,
        winningPool,
        totalPool,
        platformFee
      );

      // Net pool = 9.8 SOL
      // User share = 3/8 of 9.8 = 3.675 SOL
      expect(payout).toBe(3_675_000_000);
    });
  });
});
