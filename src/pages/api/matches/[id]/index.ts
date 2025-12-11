/**
 * GET /api/matches/:id
 * Get match details
 */

import { NextApiRequest, NextApiResponse } from "next";
import { store } from "@/lib/store";
import type { ApiResponse, Match } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Match>>
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

    const match = store.getMatch(id);

    if (!match) {
      return res.status(404).json({ success: false, error: "Match not found" });
    }

    return res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error: any) {
    console.error("Error fetching match:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
