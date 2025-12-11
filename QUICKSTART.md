# Plexo - Quick Start Guide

## Installation & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Test the Full Flow

### Option 1: Automated Demo Data

Visit http://localhost:3000/api/seed (POST request) to populate demo data

### Option 2: Manual Demo

1. Connect wallet on home page
2. Click "Create New Match"
3. Open match in incognito window
4. Second wallet joins as Player 2
5. Third wallet places bets
6. Play tic-tac-toe
7. Submit result
8. Claim payouts

## Environment

- Default: MOCK mode (no blockchain needed)
- Change to devnet: Update `.env.local`

## Key Files

- `src/lib/onchainAdapter.ts` - Blockchain interface
- `src/lib/store.ts` - In-memory backend
- `src/app/page.tsx` - Home/lobby
- `src/app/match/[id]/page.tsx` - Match detail

See README.md for full documentation.
