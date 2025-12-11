/**
 * POST /api/matches/:id/claim
 * Claim payout for winning bet
 */

import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { store } from "@/lib/store";
import { onchainAdapter } from "@/lib/onchainAdapter";
import { calculatePayout } from "@/lib/utils";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";
import type { ApiResponse, PayoutResult } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PayoutResult>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { wallet } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Match ID is required" });
    }

    if (!wallet) {
      return res
        .status(400)
        .json({ success: false, error: "wallet is required" });
    }

    const match = store.getMatch(id);

    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    if (match.status !== "FINISHED") {
      return res
        .status(400)
        .json({ success: false, error: "Match not finished yet" });
    }

    if (!match.winner || match.winner === "draw") {
      return res.status(400).json({
        success: false,
        error: "No winner (draw) - refunds not yet implemented",
      });
    }

    // Find user's bet
    const userBets = store.getBetsForWallet(wallet, id);
    const unclaimedBet = userBets.find(
      (b) => !b.claimed && b.prediction === match.winner
    );

    if (!unclaimedBet) {
      return res.status(400).json({
        success: false,
        error: "No unclaimed winning bet found",
      });
    }

    // Calculate payout
    const winningPool =
      match.winner === "player1" ? match.poolPlayer1 : match.poolPlayer2;
    const payoutAmount = calculatePayout(
      unclaimedBet.amountLamports,
      winningPool,
      match.totalPool,
      PLATFORM_FEE_PERCENT
    );

    // Claim on-chain
    let txSignature: string | undefined;
    if (match.matchPubkey) {
      let claimerPubkey: PublicKey;
      try {
        claimerPubkey = new PublicKey(wallet);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid wallet address" });
      }

      const onchainResult = await onchainAdapter.claimPayout({
        matchPubkey: match.matchPubkey,
        claimerPubkey,
      });

      if (!onchainResult.success) {
        return res.status(500).json({
          success: false,
          error: onchainResult.error || "Failed to claim payout on-chain",
        });
      }

      txSignature = onchainResult.txSignature;
    }

    // Mark bet as claimed
    store.markBetClaimed(unclaimedBet.betId);

    const result: PayoutResult = {
      wallet,
      amountLamports: payoutAmount,
      txSignature,
      success: true,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error claiming payout:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
