/**
 * Demo Data Seeder API
 * Populates store with sample data for testing
 */

import { NextApiRequest, NextApiResponse } from "next";
import { seedDemoData } from "@/lib/store";
import type { ApiResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const matchId = seedDemoData();

    return res.status(200).json({
      success: true,
      data: { matchId, message: "Demo data seeded successfully" },
    });
  } catch (error: any) {
    console.error("Error seeding demo data:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
