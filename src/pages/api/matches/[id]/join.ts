/**
 * POST /api/matches/:id/join
 * Player 2 joins a match
 */

import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import { store } from "@/lib/store";
import { onchainAdapter } from "@/lib/onchainAdapter";
import type { ApiResponse, Match } from "@/types";

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
    const { player2 } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Match ID is required" });
    }

    if (!player2) {
      return res
        .status(400)
        .json({ success: false, error: "player2 wallet is required" });
    }

    const match = store.getMatch(id);

    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    if (match.status !== "PENDING") {
      return res
        .status(400)
        .json({ success: false, error: "Match already started" });
    }

    // Validate wallet address
    let player2Pubkey: PublicKey;
    try {
      player2Pubkey = new PublicKey(player2);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid wallet address" });
    }

    // Join match on-chain
    if (match.matchPubkey) {
      const onchainResult = await onchainAdapter.joinMatch({
        matchPubkey: match.matchPubkey,
        player2Pubkey,
      });

      if (!onchainResult.success) {
        return res.status(500).json({
          success: false,
          error: onchainResult.error || "Failed to join match on-chain",
        });
      }
    }

    // Update local match
    const updatedMatch = store.joinMatch(id, player2);

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
    console.error("Error joining match:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
