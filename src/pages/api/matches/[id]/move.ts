/**
 * POST /api/matches/:id/move
 * Make a move in the game
 */

import { NextApiRequest, NextApiResponse } from "next";
import { store } from "@/lib/store";
import { isValidMove, checkWinner } from "@/lib/utils";
import type { ApiResponse, Match, PlayerSide } from "@/types";

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
    const { player, position } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Match ID is required" });
    }

    if (!player || typeof position !== "number") {
      return res.status(400).json({
        success: false,
        error: "player and position are required",
      });
    }

    const match = store.getMatch(id);

    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    if (match.status !== "LIVE" && match.status !== "BETTING_CLOSED") {
      return res
        .status(400)
        .json({ success: false, error: "Match is not active" });
    }

    // Validate move
    if (!isValidMove(match.moves, position, player as PlayerSide)) {
      return res.status(400).json({ success: false, error: "Invalid move" });
    }

    // Add move
    const move = store.addMove(id, {
      player: player as PlayerSide,
      position,
    });

    if (!move) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to add move" });
    }

    // Check for winner
    const winner = checkWinner(match.moves);
    if (winner) {
      store.updateMatch(id, {
        status: "FINISHED",
        winner,
      });
    }

    const updatedMatch = store.getMatch(id);

    return res.status(200).json({
      success: true,
      data: updatedMatch!,
    });
  } catch (error: any) {
    console.error("Error making move:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
