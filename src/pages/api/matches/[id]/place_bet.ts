/**
 * POST /api/matches/:id/place_bet
 * Place a bet on a match
 */

import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { store } from "@/lib/store";
import { onchainAdapter } from "@/lib/onchainAdapter";
import type { ApiResponse, Bet, PlayerSide } from "@/types";
import { MIN_BET_LAMPORTS, MAX_BET_LAMPORTS } from "@/lib/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Bet>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { wallet, prediction, amountLamports } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Match ID is required" });
    }

    if (!wallet || !prediction || typeof amountLamports !== "number") {
      return res.status(400).json({
        success: false,
        error: "wallet, prediction, and amountLamports are required",
      });
    }

    if (prediction !== "player1" && prediction !== "player2") {
      return res.status(400).json({
        success: false,
        error: "prediction must be player1 or player2",
      });
    }

    if (
      amountLamports < MIN_BET_LAMPORTS ||
      amountLamports > MAX_BET_LAMPORTS
    ) {
      return res.status(400).json({
        success: false,
        error: `Bet amount must be between ${MIN_BET_LAMPORTS / 1e9} and ${
          MAX_BET_LAMPORTS / 1e9
        } SOL`,
      });
    }

    const match = store.getMatch(id);

    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    if (match.status !== "PENDING" && match.status !== "LIVE") {
      return res
        .status(400)
        .json({ success: false, error: "Betting is closed" });
    }

    if (match.lockTime && Date.now() / 1000 > match.lockTime) {
      return res
        .status(400)
        .json({ success: false, error: "Betting period has ended" });
    }

    // Validate wallet
    let bettorPubkey: PublicKey;
    try {
      bettorPubkey = new PublicKey(wallet);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid wallet address" });
    }

    // Place bet on-chain
    let txSignature: string | undefined;
    if (match.matchPubkey) {
      const onchainResult = await onchainAdapter.placeBet({
        matchPubkey: match.matchPubkey,
        bettorPubkey,
        prediction: prediction as PlayerSide,
        amountLamports,
      });

      if (!onchainResult.success) {
        return res.status(500).json({
          success: false,
          error: onchainResult.error || "Failed to place bet on-chain",
        });
      }

      txSignature = onchainResult.txSignature;
    }

    // Create bet in local store
    const bet = store.createBet({
      matchId: id,
      wallet,
      prediction: prediction as PlayerSide,
      amountLamports,
      txSignature,
    });

    return res.status(201).json({
      success: true,
      data: bet,
    });
  } catch (error: any) {
    console.error("Error placing bet:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
