# 🎬 Plexo - Live Demo Script

## Pre-Demo Setup (2 minutes before)

### 1. Start the Application

```bash
npm run dev
```

Wait for "Ready in X.Xs" message

### 2. Open Browser Windows

- **Window 1**: http://localhost:3000 (Player 1)
- **Window 2**: http://localhost:3000 (Incognito - Player 2)
- **Window 3**: http://localhost:3000 (Incognito - Spectator)

### 3. Optional: Pre-seed Data

If you want existing matches in lobby:

```bash
curl -X POST http://localhost:3000/api/seed
```

---

## Demo Script (8 Minutes)

### 🎯 Act 1: Introduction (1 minute)

**Say:**

> "Welcome to Plexo - a real-time GameFi platform where players compete in skill-based games while spectators place bets on the outcome. All settled on Solana blockchain."

**Show:**

- Landing page with hero section
- Stats boxes (Active Matches, Live Games, Platform Fee)
- Clean, modern UI

**Highlight:**

- "Built with Next.js, Tailwind, and Solana"
- "Currently in mock mode - no blockchain needed for demo"
- "Can switch to devnet with one environment variable"

---

### 🎮 Act 2: Create Match (1 minute)

**Window 1 (Player 1):**

1. **Click** "🎮 Create New Match" button

   - **Show** smooth animation
   - **Point out** transaction toast appearing

2. **Arrive** at match page
   - **Show** match status: "Waiting for Player 2"
   - **Show** your wallet as Player 1 (X)
   - **Point out** game board (empty)
   - **Point out** betting panel (right side)

**Say:**

> "Match created! Now we need a second player to join. Notice the betting panel is already active - spectators can bet even before the game starts."

---

### 👥 Act 3: Player 2 Joins (1 minute)

**Window 2 (Player 2 - Incognito):**

1. **Copy** match URL from Window 1
2. **Paste** into Window 2
3. **Click** green "Join as Player 2" button
   - **Show** transaction toast

**Both Windows:**

- **Status changes** to "Game Live - Betting Open"
- **Both players visible** on board
- **Betting panel** shows both players

**Say:**

> "Player 2 has joined! The match is now live. Notice how the status updated across all windows automatically through polling. Spectators can now place their bets!"

---

### 💰 Act 4: Place Bets (2 minutes)

**Window 3 (Spectator):**

1. **Scroll** to betting panel
2. **Click** on "Player 1 (X)" card

   - **Card highlights** in blue

3. **Enter** bet amount: `0.5` SOL
4. **Click** "Bet 0.5 SOL on Player 1"

   - **Transaction toast** appears: "Placing bet..."
   - **Toast updates** to "Bet placed successfully!"

5. **Show** pool updates:
   - Player 1 Pool: 0.5 SOL
   - Total Pool: 0.5 SOL
   - Odds: 1.00x

**Optional - Place Second Bet:** 6. **Select** Player 2 (O) 7. **Enter** `0.3` SOL 8. **Click** "Bet 0.3 SOL on Player 2"

**Show updated pools:**

- Player 1 Pool: 0.5 SOL
- Player 2 Pool: 0.3 SOL
- Total Pool: 0.8 SOL
- Odds updated dynamically

**Say:**

> "Spectators can bet on either player. The pools update in real-time, and odds are calculated automatically. The platform takes a 2% fee, which is shown in the betting panel."

---

### 🎲 Act 5: Play the Game (2 minutes)

**Window 1 (Player 1):**

1. **Click** center square (position 4)
   - **X appears** with smooth scale animation
   - **Turn indicator** shows "Waiting for opponent..."

**Window 2 (Player 2):**

2. **Board updates** automatically
3. **Click** top-left square (position 0)
   - **O appears** with animation

**Alternate between windows:**

4. **Player 1** clicks position 3 (middle-left)
5. **Player 2** clicks position 1 (top-middle)
6. **Player 1** clicks position 5 (middle-right)
   - **WINNING MOVE!**
   - **Three squares highlight** in green (3-4-5 horizontal)
   - **Status** shows "Match Finished"

**Say:**

> "The game validates every move - you can't click twice in a row or click occupied squares. When someone wins, the winning pattern highlights automatically. Player 1 wins with a horizontal line!"

---

### 🏆 Act 6: Submit Result (1 minute)

**Window 1 (Player 1 - Match Creator):**

1. **Scroll down** to purple "Match Creator Controls" panel
2. **Select** "Player 1 Wins (X)"

   - **Show** pool amounts for each side

3. **Click** "Submit Result"
4. **Confirmation modal** appears

   - **Read** warning: "This action cannot be undone"
   - **Show** payout info

5. **Click** "Confirm"
   - **Transaction toast**: "Submitting match result..."
   - **Toast updates**: "Match result submitted!"

**All Windows:**

- **Status** changes to "Match Finished"
- **Winner** displayed prominently

**Say:**

> "Only the match creator can submit results. In a production environment, this could be expanded to include dispute resolution or automated result detection. For now, it's a manual process to maintain flexibility."

---

### 💸 Act 7: Claim Payout (1 minute)

**Window 3 (Winning Spectator):**

1. **Green button** appears: "Claim Payout"
2. **Click** to claim

   - **Transaction toast**: "Claiming payout..."

3. **Calculation shown**:

   ```
   Your bet: 0.5 SOL (on Player 1)
   Total pool: 0.8 SOL
   Platform fee: 0.016 SOL (2%)
   Net pool: 0.784 SOL
   Your share: 0.5 / 0.5 = 100% of winning pool
   Payout: 0.784 SOL
   ```

4. **Toast updates**: "Claimed 0.784 SOL!"
5. **Show** transaction signature link (if in devnet mode)

**Say:**

> "Winners claim their proportional share of the total pool, minus the 2% platform fee. If multiple people bet on the winning side, the payout is split proportionally based on bet amounts. In this case, our spectator bet 0.5 SOL and won 0.784 SOL - a nice profit!"

---

## 🎬 Closing (1 minute)

### Summary Points

**Say:**

> "Let's recap what we just saw:
>
> 1. **Match Creation** - Quick and easy, shareable link
> 2. **Player Joining** - Seamless onboarding for Player 2
> 3. **Live Betting** - Real-time pools and odds
> 4. **Gameplay** - Skill-based tic-tac-toe with validation
> 5. **Result Submission** - Match creator control
> 6. **Payout Claims** - Automatic calculation with platform fee
>
> All of this is currently running in mock mode - no blockchain required. But with a simple environment variable change, it switches to Solana devnet for real on-chain transactions.
>
> The UI is production-ready, mobile-responsive, and built with modern web technologies. The architecture is clean and modular, making it easy to:
>
> - Add new games (chess, poker, etc.)
> - Integrate with any Solana program
> - Scale to thousands of matches
> - Deploy to production in minutes
>
> The entire application is open-source and ready for hackathon judging!"

---

## 🔍 Bonus Demo Features (If Time Allows)

### Show Mobile Responsiveness

1. **Open DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Select** iPhone 12 Pro
4. **Show** betting panel stacks under game board
5. **Show** all buttons remain accessible

### Show Mock vs Devnet Toggle

1. **Open** `.env.local`
2. **Show** `NEXT_PUBLIC_ADAPTER_MODE=mock`
3. **Explain** changing to `devnet` switches modes
4. **Open** `src/lib/onchainAdapter.ts`
5. **Show** clear TODOs for on-chain implementation

### Show Code Quality

1. **Open** `src/lib/utils.ts`
2. **Show** clean functions with JSDoc comments
3. **Show** TypeScript types
4. **Open** `__tests__/utils.test.ts`
5. **Show** comprehensive unit tests

### Show API Documentation

1. **Open** README.md
2. **Scroll** to API specification section
3. **Show** all 9 endpoints documented
4. **Show** request/response examples

---

## 🎭 Alternative Demo Paths

### Quick Demo (3 minutes)

1. Create match (30s)
2. Show pre-made match with bets (30s)
3. Make 2 moves (1min)
4. Submit result (30s)
5. Claim payout (30s)

### Technical Deep Dive (15 minutes)

1. Full demo above (8min)
2. Code walkthrough (5min)
3. Architecture explanation (2min)

### Business Focus (5 minutes)

1. Problem statement (1min)
2. Quick demo (3min)
3. Market opportunity (1min)

---

## 📝 Demo Tips

### Before Starting

- [ ] Close unnecessary browser tabs
- [ ] Clear browser console
- [ ] Check dev server is running
- [ ] Test wallet connections (if using devnet)
- [ ] Have backup recordings

### During Demo

- [ ] Speak clearly and confidently
- [ ] Point with mouse cursor
- [ ] Pause for animations
- [ ] Explain what's happening
- [ ] Show transaction toasts

### If Something Breaks

- [ ] Have backup demo video
- [ ] Know how to restart server quickly
- [ ] Can show code instead of live demo
- [ ] Explain mock mode is resilient

---

## 🎤 Talking Points

### Technical Excellence

- "Built with Next.js 14, TypeScript, and Tailwind CSS"
- "Production-ready code with full type safety"
- "Comprehensive test coverage"
- "Clean architecture, easy to extend"

### Blockchain Integration

- "Seamless Solana integration via Wallet Adapter"
- "Mock mode for instant demos"
- "One-line switch to devnet"
- "Clear interface for on-chain developers"

### User Experience

- "Modern, polished UI"
- "Mobile-first responsive design"
- "Real-time updates via polling"
- "Clear transaction status feedback"

### Business Value

- "Low 2% platform fee"
- "Skill-based games (not gambling)"
- "Transparent on-chain settlement"
- "Scalable architecture"

---

**Demo script complete! Good luck with your presentation! 🚀**
