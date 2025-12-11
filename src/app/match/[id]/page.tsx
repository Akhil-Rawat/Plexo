/**
 * Match Detail Page
 * Game board, betting panel, and admin controls
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { PublicKey } from "@solana/web3.js";
import TicTacToeBoard from "@/components/TicTacToeBoard";
import BettingPanel from "@/components/BettingPanel";
import AdminControls from "@/components/AdminControls";
import TxToast from "@/components/TxToast";
import {
  getCurrentTurn,
  checkWinner,
  formatWalletAddress,
  lamportsToSol,
} from "@/lib/utils";
import { MATCH_STATUSES } from "@/lib/constants";
import type {
  Match,
  PlayerSide,
  GameResult,
  Transaction,
  ApiResponse,
} from "@/types";

export default function MatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { publicKey } = useWallet();

  const matchId = (params?.id as string) || "";
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (matchId) {
      loadMatch();
      const interval = setInterval(loadMatch, 3000);
      return () => clearInterval(interval);
    }
  }, [matchId]);

  useEffect(() => {
    if (searchParams?.get("action") === "join" && match && publicKey) {
      handleJoinMatch();
    }
  }, [searchParams, match, publicKey]);

  const loadMatch = async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}`);
      const data: ApiResponse<Match> = await res.json();
      if (data.success && data.data) {
        setMatch(data.data);
      } else {
        alert("Match not found");
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to load match:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async () => {
    if (!publicKey || !match) return;

    setTransaction({
      id: "join",
      status: "pending",
      message: "Joining match...",
    });

    try {
      const res = await fetch(`/api/matches/${matchId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player2: publicKey.toBase58() }),
      });

      const data: ApiResponse<Match> = await res.json();

      if (data.success) {
        setTransaction({
          id: "join",
          status: "success",
          message: "Successfully joined match!",
        });
        loadMatch();
      } else {
        throw new Error(data.error || "Failed to join match");
      }
    } catch (error: any) {
      setTransaction({
        id: "join",
        status: "error",
        message: "Failed to join match",
        error: error.message,
      });
    }
  };

  const handleMakeMove = async (position: number) => {
    if (!match || !publicKey) return;

    const userSide = getUserSide();
    if (!userSide) return;

    setTransaction({
      id: "move",
      status: "pending",
      message: "Making move...",
    });

    try {
      const res = await fetch(`/api/matches/${matchId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: userSide, position }),
      });

      const data: ApiResponse<Match> = await res.json();

      if (data.success) {
        setTransaction({
          id: "move",
          status: "success",
          message: "Move recorded!",
        });
        loadMatch();
      } else {
        throw new Error(data.error || "Invalid move");
      }
    } catch (error: any) {
      setTransaction({
        id: "move",
        status: "error",
        message: "Failed to make move",
        error: error.message,
      });
    }
  };

  const handlePlaceBet = async (
    prediction: PlayerSide,
    amountLamports: number
  ) => {
    if (!publicKey || !match) return;

    setTransaction({
      id: "bet",
      status: "pending",
      message: `Placing bet: ${lamportsToSol(amountLamports)} SOL...`,
    });

    try {
      const res = await fetch(`/api/matches/${matchId}/place_bet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          prediction,
          amountLamports,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTransaction({
          id: "bet",
          status: "success",
          message: `Bet placed successfully!`,
          signature: data.data?.txSignature,
        });
        loadMatch();
      } else {
        throw new Error(data.error || "Failed to place bet");
      }
    } catch (error: any) {
      setTransaction({
        id: "bet",
        status: "error",
        message: "Failed to place bet",
        error: error.message,
      });
    }
  };

  const handleSubmitResult = async (winner: GameResult) => {
    if (!publicKey || !match) return;

    setTransaction({
      id: "result",
      status: "pending",
      message: "Submitting match result...",
    });

    try {
      const res = await fetch(`/api/matches/${matchId}/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner,
          authority: publicKey.toBase58(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTransaction({
          id: "result",
          status: "success",
          message: "Match result submitted!",
        });
        loadMatch();
      } else {
        throw new Error(data.error || "Failed to submit result");
      }
    } catch (error: any) {
      setTransaction({
        id: "result",
        status: "error",
        message: "Failed to submit result",
        error: error.message,
      });
    }
  };

  const handleClaimPayout = async () => {
    if (!publicKey || !match) return;

    setTransaction({
      id: "claim",
      status: "pending",
      message: "Claiming payout...",
    });

    try {
      const res = await fetch(`/api/matches/${matchId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });

      const data = await res.json();

      if (data.success) {
        setTransaction({
          id: "claim",
          status: "success",
          message: `Claimed ${lamportsToSol(
            data.data?.amountLamports || 0
          )} SOL!`,
          signature: data.data?.txSignature,
        });
        loadMatch();
      } else {
        throw new Error(data.error || "Failed to claim payout");
      }
    } catch (error: any) {
      setTransaction({
        id: "claim",
        status: "error",
        message: "Failed to claim payout",
        error: error.message,
      });
    }
  };

  const getUserSide = (): PlayerSide | null => {
    if (!match || !publicKey) return null;
    if (match.player1 === publicKey.toBase58()) return "player1";
    if (match.player2 === publicKey.toBase58()) return "player2";
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading match...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-900 mb-4">Match not found</p>
          <button
            onClick={() => router.push("/")}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            ← Back to lobby
          </button>
        </div>
      </div>
    );
  }

  const userSide = getUserSide();
  const currentTurn = getCurrentTurn(match.moves);
  const winner = checkWinner(match.moves);
  const statusConfig = MATCH_STATUSES[match.status];
  const isPlayer = userSide !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900 font-semibold"
            >
              ← Back to Lobby
            </button>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Match Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 mb-8 ${statusConfig.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {match.metadata?.title || "Tic-Tac-Toe Match"}
              </h2>
              <p className="text-sm mt-1">{statusConfig.label}</p>
            </div>
            {winner && (
              <div className="text-right">
                <p className="text-sm">Winner</p>
                <p className="text-2xl font-bold">
                  {winner === "draw"
                    ? "Draw!"
                    : winner === "player1"
                    ? "Player 1 (X)"
                    : "Player 2 (O)"}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Game Board */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Game Board
                </h3>

                {/* Players Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-primary-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">Player 1 (X)</p>
                    <p className="font-mono text-sm font-semibold">
                      {formatWalletAddress(match.player1)}
                    </p>
                    {userSide === "player1" && (
                      <span className="text-xs text-primary-600 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="bg-danger-50 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">Player 2 (O)</p>
                    <p className="font-mono text-sm font-semibold">
                      {match.player2
                        ? formatWalletAddress(match.player2)
                        : "Waiting..."}
                    </p>
                    {userSide === "player2" && (
                      <span className="text-xs text-danger-600 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <TicTacToeBoard
                moves={match.moves}
                onMakeMove={
                  isPlayer && match.status === "LIVE"
                    ? handleMakeMove
                    : undefined
                }
                currentPlayer={currentTurn}
                disabled={match.status !== "LIVE" || !isPlayer}
                userSide={userSide || undefined}
              />

              {/* Join Button for Spectators */}
              {match.status === "PENDING" &&
                !match.player2 &&
                !isPlayer &&
                publicKey && (
                  <motion.button
                    onClick={handleJoinMatch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold py-4 rounded-2xl shadow-lg"
                  >
                    Join as Player 2
                  </motion.button>
                )}

              {/* Claim Payout Button */}
              {match.status === "FINISHED" &&
                match.winner &&
                match.winner !== "draw" &&
                !isPlayer &&
                publicKey && (
                  <motion.button
                    onClick={handleClaimPayout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-2xl shadow-lg"
                  >
                    Claim Payout
                  </motion.button>
                )}
            </div>

            {/* Admin Controls */}
            {publicKey && (
              <AdminControls
                match={match}
                userWallet={publicKey.toBase58()}
                onSubmitResult={handleSubmitResult}
              />
            )}
          </div>

          {/* Right Column: Betting Panel */}
          <div className="space-y-6">
            <BettingPanel
              match={match}
              userWallet={publicKey?.toBase58()}
              onPlaceBet={handlePlaceBet}
              disabled={isPlayer}
            />

            {/* Match Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">Match Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Match ID:</span>
                  <span className="font-mono text-xs">
                    {match.matchId.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Moves:</span>
                  <span className="font-semibold">{match.moves.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(match.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Toast */}
      <TxToast transaction={transaction} onClose={() => setTransaction(null)} />
    </div>
  );
}
