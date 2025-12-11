/**
 * GET /api/matches/:id/bets
 * Get all bets for a match
 */

import { NextApiRequest, NextApiResponse } from "next";
import { store } from "@/lib/store";
import type { ApiResponse, Bet } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Bet[]>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Match ID is required" });
    }

    const bets = store.getBetsForMatch(id);

    return res.status(200).json({
      success: true,
      data: bets,
    });
  } catch (error: any) {
    console.error("Error fetching bets:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
