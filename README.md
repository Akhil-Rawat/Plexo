# Plexo - GameFi Prediction Platform

Real-time GameFi DApp where two players compete in tic-tac-toe while spectators place bets on the outcome. Built on Solana with a production-ready Next.js frontend.

## 🎮 Features

- **Skill-based 1v1 Tic-Tac-Toe** with real-time gameplay
- **Live spectator betting** on match outcomes
- **Solana blockchain integration** for transparent bet settlement
- **Mock mode** for local development without deployed contract
- **Production-ready UI** with Tailwind CSS and Framer Motion animations
- **Mobile-responsive** design
- **Wallet integration** via Solana Wallet Adapter (Phantom, Solflare)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A Solana wallet (Phantom recommended) for testing

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Adapter mode: 'mock' or 'devnet'
NEXT_PUBLIC_ADAPTER_MODE=mock

# Solana network: 'devnet', 'testnet', 'mainnet-beta'
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Optional: Custom RPC endpoint
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com

# Optional: Deployed program ID (required for devnet mode)
NEXT_PUBLIC_PLEXO_PROGRAM_ID=YourProgramIdHere
```

### Switching Between Mock and Devnet

**Mock Mode (Default)**

- Works without deployed Solana program
- Simulates all blockchain interactions
- Perfect for development and demos
- Set `NEXT_PUBLIC_ADAPTER_MODE=mock`

**Devnet Mode**

- Requires deployed Solana program
- Real blockchain transactions
- Set `NEXT_PUBLIC_ADAPTER_MODE=devnet`
- Set `NEXT_PUBLIC_PLEXO_PROGRAM_ID` to your program's address

## 🎯 Demo Script

Follow this script for a complete demo walkthrough:

### 1. Setup (30 seconds)

```bash
npm run dev
```

- Open http://localhost:3000
- Connect Phantom wallet (devnet mode)
- Note: Mock mode doesn't require real wallet connection

### 2. Create Match (1 minute)

- Click **"🎮 Create New Match"** button
- Transaction confirmation appears
- You're redirected to the match page
- Note your wallet address shown as "Player 1 (X)"

### 3. Join as Player 2 (1 minute)

- Open match link in incognito/another browser OR
- Use a different wallet to join
- Click **"Join as Player 2"** button
- Both players now visible on board
- Match status changes to "Game Live - Betting Open"

### 4. Spectators Place Bets (2 minutes)

- As a spectator (non-player wallet):
  - View the betting panel on the right
  - See current pools for Player 1 and Player 2
  - Select prediction (Player 1 or Player 2)
  - Enter bet amount (0.1 - 10 SOL)
  - Click **"Bet X SOL on Player Y"**
  - Transaction toast appears
- Multiple spectators can bet
- Watch pools update in real-time

### 5. Play the Game (2 minutes)

- Player 1 makes first move (click any square)
- Player 2 responds
- Continue alternating turns
- Board shows X and O with animations
- Winner detection automatic (3 in a row)

### 6. Submit Result (1 minute)

- Match creator sees **"Match Creator Controls"** panel
- Select winner: Player 1, Player 2, or Draw
- Click **"Submit Result"**
- Confirm in modal
- Match status changes to "Match Finished"

### 7. Claim Payouts (1 minute)

- Winning bettors see **"Claim Payout"** button
- Click to claim winnings
- Payout calculated:
  - User's share = (bet amount / winning pool) × (total pool - 2% fee)
  - Transaction toast shows amount claimed
- Toast displays transaction signature

### Complete Demo Flow Example

```
┌─────────────────────────────────────────────┐
│ 1. Alice creates match                      │
│    → Becomes Player 1 (X)                   │
├─────────────────────────────────────────────┤
│ 2. Bob joins match                          │
│    → Becomes Player 2 (O)                   │
├─────────────────────────────────────────────┤
│ 3. Spectators bet:                          │
│    → Charlie bets 5 SOL on Player 1         │
│    → Diana bets 2 SOL on Player 2           │
│    → Eve bets 3 SOL on Player 1             │
│    Total Pool: 10 SOL                       │
│    Player 1 Pool: 8 SOL                     │
│    Player 2 Pool: 2 SOL                     │
├─────────────────────────────────────────────┤
│ 4. Alice and Bob play tic-tac-toe          │
│    → Alice wins (Player 1)                  │
├─────────────────────────────────────────────┤
│ 5. Alice submits result: Player 1 Wins     │
├─────────────────────────────────────────────┤
│ 6. Winners claim payouts:                   │
│    → Platform fee: 0.2 SOL (2%)            │
│    → Net pool: 9.8 SOL                     │
│    → Charlie claims: (5/8) × 9.8 = 6.125  │
│    → Eve claims: (3/8) × 9.8 = 3.675      │
│    → Diana: no payout (lost)               │
└─────────────────────────────────────────────┘
```

## 🏗️ Architecture

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Wallet**: Solana Wallet Adapter
- **Blockchain**: @solana/web3.js

### Backend (API Routes)

- `POST /api/matches` - Create new match
- `GET /api/matches/list` - List all matches
- `GET /api/matches/:id` - Get match details
- `POST /api/matches/:id/join` - Join match as Player 2
- `POST /api/matches/:id/move` - Make a move
- `POST /api/matches/:id/place_bet` - Place bet
- `POST /api/matches/:id/finish` - Submit result (admin)
- `POST /api/matches/:id/claim` - Claim payout

### Onchain Adapter (`src/lib/onchainAdapter.ts`)

The adapter provides a unified interface with two modes:

**Mock Mode** (default):

- In-memory state management
- Simulated transaction latency
- Deterministic for demos
- No blockchain required

**Devnet Mode**:

- Real Solana transactions
- Requires deployed program
- PDA-based account management

#### Required Program Instructions

Your on-chain developer should implement:

1. **`create_match`** - Creates match PDA with betting pools
2. **`join_match`** - Player 2 joins, sets lock time
3. **`place_bet`** - Transfers SOL to escrow, updates pools
4. **`report_result`** - Sets winner (authority: match creator)
5. **`claim_payout`** - Distributes winnings to bettors

See `src/lib/onchainAdapter.ts` for detailed function signatures and TODOs.

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

Tests cover:

- Tic-tac-toe winner detection
- Move validation logic
- Payout calculations
- Edge cases (draws, invalid moves)

### Manual Testing Checklist

- [ ] Create match with wallet connected
- [ ] Join match as second player
- [ ] Place bet as spectator
- [ ] Make moves and verify turn validation
- [ ] Submit match result as creator
- [ ] Claim payout as winning bettor
- [ ] Test mobile responsive layout
- [ ] Test wallet disconnect handling
- [ ] Verify transaction toasts appear

## 📁 Project Structure

```
plexo/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with wallet provider
│   │   ├── page.tsx              # Home/lobby page
│   │   └── match/[id]/
│   │       └── page.tsx          # Match detail page
│   ├── components/
│   │   ├── TicTacToeBoard.tsx   # Game board component
│   │   ├── BettingPanel.tsx      # Betting UI
│   │   ├── MatchCard.tsx         # Match list card
│   │   ├── AdminControls.tsx     # Match creator controls
│   │   ├── TxToast.tsx           # Transaction notifications
│   │   └── WalletProvider.tsx    # Solana wallet setup
│   ├── lib/
│   │   ├── onchainAdapter.ts    # 🔑 Blockchain adapter (mock/devnet)
│   │   ├── store.ts              # In-memory data store
│   │   ├── utils.ts              # Game logic & helpers
│   │   └── constants.ts          # Configuration constants
│   ├── pages/api/
│   │   └── matches/
│   │       ├── index.ts          # Create match
│   │       ├── list.ts           # List matches
│   │       └── [id]/
│   │           ├── index.ts      # Get match
│   │           ├── join.ts       # Join match
│   │           ├── move.ts       # Make move
│   │           ├── place_bet.ts  # Place bet
│   │           ├── finish.ts     # Submit result
│   │           ├── claim.ts      # Claim payout
│   │           └── bets.ts       # Get bets
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── styles/
│       └── globals.css           # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔌 Integration with Solana Program

### For the On-Chain Developer

The frontend expects the following program structure:

#### Match PDA Structure

```rust
pub struct Match {
    pub player1: Pubkey,
    pub player2: Option<Pubkey>,
    pub status: MatchStatus, // PENDING, LIVE, FINISHED
    pub pool_player1: u64,    // lamports
    pub pool_player2: u64,    // lamports
    pub total_pool: u64,      // lamports
    pub winner: Option<u8>,   // 0=player1, 1=player2, 2=draw
    pub lock_time: i64,       // Unix timestamp
    pub created_at: i64,
}
```

#### Program Instructions

See `src/lib/onchainAdapter.ts` DevnetAdapter class for expected instruction formats and PDA derivations.

## 🎨 UI Components

### Key Components

- **TicTacToeBoard** - Interactive 3×3 grid with animations
- **BettingPanel** - Pool stats, bet input, odds display
- **MatchCard** - List view with status, pools, CTAs
- **AdminControls** - Result submission for match creator
- **TxToast** - Transaction status notifications

All components use:

- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Responsive design** (mobile-first)

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:

- `NEXT_PUBLIC_ADAPTER_MODE`
- `NEXT_PUBLIC_PLEXO_PROGRAM_ID` (if using devnet)

### Other Platforms

Works on any platform supporting Next.js:

- Netlify
- Railway
- AWS Amplify
- Self-hosted with `npm run build && npm start`

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ for Solana hackathons
