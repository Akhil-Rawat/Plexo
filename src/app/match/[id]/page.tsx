/**
 * Match Detail Page (Premium Design)
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
import Card from "@/components/Card";
import Button from "@/components/Button";
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
import { ArrowLeft, Users, Trophy } from "lucide-react";

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
      console.error("Failed to load match:");
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
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading match...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Match not found</p>
          <Button onClick={() => router.push("/")} variant="outline">
            ← Back to lobby
          </Button>
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
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Back to Lobby
            </Button>
            <WalletMultiButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Match Status Banner */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-display font-bold text-white">
                  {match.metadata?.title || "Tic-Tac-Toe Match"}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}
                >
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Match ID: {matchId.slice(0, 16)}...
              </p>
            </div>
            {winner && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-accent">
                  <Trophy className="w-6 h-6" />
                  <span className="text-sm">Winner</span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {winner === "draw"
                    ? "Draw!"
                    : winner === "player1"
                    ? "Player 1 (X)"
                    : "Player 2 (O)"}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Game Board */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Game Board
                </h3>

                {/* Players Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Player 1 (X)</p>
                    <p className="font-mono text-sm font-semibold text-secondary">
                      {formatWalletAddress(match.player1)}
                    </p>
                    {userSide === "player1" && (
                      <span className="text-xs text-secondary font-bold mt-1 inline-block">
                        You
                      </span>
                    )}
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Player 2 (O)</p>
                    <p className="font-mono text-sm font-semibold text-primary">
                      {match.player2
                        ? formatWalletAddress(match.player2)
                        : "Waiting..."}
                    </p>
                    {userSide === "player2" && (
                      <span className="text-xs text-primary font-bold mt-1 inline-block">
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
                  <Button
                    onClick={handleJoinMatch}
                    fullWidth
                    size="lg"
                    className="mt-6"
                  >
                    Join as Player 2
                  </Button>
                )}

              {/* Claim Payout Button */}
              {match.status === "FINISHED" &&
                match.winner &&
                match.winner !== "draw" &&
                !isPlayer &&
                publicKey && (
                  <Button onClick={handleClaimPayout} fullWidth size="lg">
                    Claim Payout
                  </Button>
                )}
            </Card>

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
            <Card>
              <BettingPanel
                match={match}
                userWallet={publicKey?.toBase58()}
                onPlaceBet={handlePlaceBet}
                disabled={isPlayer}
              />
            </Card>

            {/* Match Info Card */}
            <Card>
              <h4 className="font-bold text-white mb-4">Match Stats</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Match ID:</span>
                  <span className="font-mono text-xs text-gray-300">
                    {match.matchId.slice(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Moves:</span>
                  <span className="font-semibold text-white">
                    {match.moves.length} / 9
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Pool:</span>
                  <span className="font-semibold text-accent">
                    {lamportsToSol(match.totalPool)} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300 text-xs">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Transaction Toast */}
      <TxToast transaction={transaction} onClose={() => setTransaction(null)} />
    </div>
  );
}
