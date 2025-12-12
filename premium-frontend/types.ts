export type Player = {
  id: string;
  name: string;
  avatar: string; // URL
  winRate: number;
};

export type MatchStatus = 'LIVE' | 'SCHEDULED' | 'FINISHED';

export type Match = {
  id: string;
  player1: Player;
  player2: Player;
  status: MatchStatus;
  poolSize: number; // In SOL or USD
  viewers: number;
  startTime?: Date;
  boardState: (string | null)[]; // 9 cells
  currentTurn: 'X' | 'O';
};

export interface BetOption {
  id: 'player1' | 'draw' | 'player2';
  label: string;
  odds: number;
  poolShare: number;
}
