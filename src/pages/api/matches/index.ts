/**
 * POST /api/matches
 * Create a new match
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
    const { player1, player2, metadata } = req.body;

    if (!player1) {
      return res
        .status(400)
        .json({ success: false, error: "player1 is required" });
    }

    // Validate wallet addresses
    let player1Pubkey: PublicKey;
    let player2Pubkey: PublicKey | undefined;

    try {
      player1Pubkey = new PublicKey(player1);
      if (player2) {
        player2Pubkey = new PublicKey(player2);
      }
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid wallet address" });
    }

    // Create match on-chain (or mock)
    const onchainResult = await onchainAdapter.createMatch({
      player1Pubkey,
      player2Pubkey,
      metadata,
    });

    if (!onchainResult.success) {
      return res.status(500).json({
        success: false,
        error: onchainResult.error || "Failed to create match on-chain",
      });
    }

    // Create match in local store
    const match = store.createMatch({
      player1,
      player2,
      metadata,
      matchPubkey: onchainResult.matchPubkey,
    });

    return res.status(201).json({
      success: true,
      data: match,
    });
  } catch (error: any) {
    console.error("Error creating match:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
