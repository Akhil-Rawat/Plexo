/**
 * POST /api/matches/:id/finish
 * Submit match result (admin only)
 */

import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { store } from "@/lib/store";
import { onchainAdapter } from "@/lib/onchainAdapter";
import type { ApiResponse, Match, GameResult } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Match>>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { winner, authority } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Match ID is required" });
    }

    if (!winner) {
      return res
        .status(400)
        .json({ success: false, error: "winner is required" });
    }

    if (winner !== "player1" && winner !== "player2" && winner !== "draw") {
      return res.status(400).json({
        success: false,
        error: "winner must be player1, player2, or draw",
      });
    }

    const match = store.getMatch(id);

    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    if (match.status === "FINISHED") {
      return res
        .status(400)
        .json({ success: false, error: "Match already finished" });
    }

    // Verify authority (match creator)
    if (authority && authority !== match.player1) {
      return res.status(403).json({
        success: false,
        error: "Only match creator can submit result",
      });
    }

    // Report result on-chain
    if (match.matchPubkey && authority) {
      let authorityPubkey: PublicKey;
      try {
        authorityPubkey = new PublicKey(authority);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid authority address" });
      }

      const onchainResult = await onchainAdapter.reportResult({
        matchPubkey: match.matchPubkey,
        winner: winner as GameResult,
        authorityPubkey,
      });

      if (!onchainResult.success) {
        return res.status(500).json({
          success: false,
          error: onchainResult.error || "Failed to report result on-chain",
        });
      }
    }

    // Update local match
    const updatedMatch = store.setMatchResult(id, winner as GameResult);

    if (!updatedMatch) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to update match" });
    }

    return res.status(200).json({
      success: true,
      data: updatedMatch,
    });
  } catch (error: any) {
    console.error("Error finishing match:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
