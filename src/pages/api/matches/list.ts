/**
 * GET /api/matches
 * List all matches
 */

import { NextApiRequest, NextApiResponse } from "next";
import { store } from "@/lib/store";
import type { ApiResponse, Match } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Match[]>>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const matches = store.getAllMatches();

    return res.status(200).json({
      success: true,
      data: matches,
    });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
