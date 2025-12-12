import { Variants } from 'framer-motion';
import { Match } from './types';
import React from 'react';
import { Grid3X3, Swords, CircleDot } from 'lucide-react';

// Animation Variants (Framer Motion)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
};

export const hoverLift: Variants = {
  hover: { 
    y: -8, 
    transition: { duration: 0.3, ease: "easeOut" } 
  },
};

// Mock Data
export const GAMES = [
  { id: 'ttt', name: 'Tic-Tac-Toe', icon: 'Grid3X3', activeCount: 12 },
  { id: 'chess', name: 'Speed Chess', icon: 'Swords', activeCount: 5 },
  { id: 'connect4', name: 'Connect 4', icon: 'CircleDot', activeCount: 8 },
];

export const MOCK_MATCHES: (Match & { gameType: string })[] = [
  {
    id: 'm1',
    gameType: 'Tic-Tac-Toe',
    player1: { id: 'p1', name: 'CyberNinja', avatar: 'https://picsum.photos/100/100?random=1', winRate: 78 },
    player2: { id: 'p2', name: 'NeonStriker', avatar: 'https://picsum.photos/100/100?random=2', winRate: 64 },
    status: 'LIVE',
    poolSize: 1245.50,
    viewers: 3420,
    boardState: ['X', null, 'O', null, 'X', null, null, null, null],
    currentTurn: 'O',
  },
  {
    id: 'm2',
    gameType: 'Tic-Tac-Toe',
    player1: { id: 'p3', name: 'AlphaZero', avatar: 'https://picsum.photos/100/100?random=3', winRate: 92 },
    player2: { id: 'p4', name: 'DeepMind', avatar: 'https://picsum.photos/100/100?random=4', winRate: 88 },
    status: 'SCHEDULED',
    poolSize: 5000.00,
    viewers: 1205,
    startTime: new Date(Date.now() + 3600000), // 1 hour later
    boardState: Array(9).fill(null),
    currentTurn: 'X',
  },
  {
    id: 'm3',
    gameType: 'Tic-Tac-Toe',
    player1: { id: 'p5', name: 'PixelMaster', avatar: 'https://picsum.photos/100/100?random=5', winRate: 55 },
    player2: { id: 'p6', name: 'VoxelQueen', avatar: 'https://picsum.photos/100/100?random=6', winRate: 61 },
    status: 'LIVE',
    poolSize: 850.25,
    viewers: 890,
    boardState: ['O', 'X', 'O', 'X', 'X', null, null, 'O', null],
    currentTurn: 'O',
  },
  {
    id: 'c1',
    gameType: 'Speed Chess',
    player1: { id: 'p7', name: 'GrandMasterX', avatar: 'https://picsum.photos/100/100?random=7', winRate: 95 },
    player2: { id: 'p8', name: 'RookieKing', avatar: 'https://picsum.photos/100/100?random=8', winRate: 45 },
    status: 'LIVE',
    poolSize: 12500.00,
    viewers: 15420,
    boardState: [], // Placeholder
    currentTurn: 'X',
  }
];
