use anchor_lang::prelude::*;

#[account]
pub struct Pool {
    // Match info
    pub player_a: Pubkey,
    pub player_b: Pubkey,
    pub match_id: Pubkey,

    // Admin (who created / controls the pool)
    pub admin: Pubkey,

    // Token & vault info
    pub token_mint: Pubkey,
    pub vault: Pubkey,                // main pool vault (holds bets until settlement)
    pub player_prize_vault: Pubkey,   // separate vault for player prize
    pub bump: u8,                     // pool PDA bump
    pub vault_bump: u8,               // vault PDA bump
    pub player_prize_vault_bump: u8,  // player prize vault bump

    // Betting totals
    pub total_for_a: u64,
    pub total_for_b: u64,

    // State
    pub is_open: bool,
    pub is_settled: bool,
    pub result: u8, // 0 = none, 1 = A wins, 2 = B wins

    // Settlement snapshot (filled in settle_pool)
    pub winner_pool: u64,
    pub distributable: u64,
    pub fee_amount: u64,
    pub player_prize_amount: u64,

    // Claim tracking
    pub player_prize_claimed: bool,
}

impl Pool {
    pub const SPACE: usize = 8 // anchor discriminator
        // match & players
        + 32 + 32 + 32
        // admin
        + 32
        // token + vaults
        + 32 + 32 + 32
        // bumps
        + 1 + 1 + 1
        // totals
        + 8 + 8
        // states
        + 1 + 1 + 1
        // settlement numbers
        + 8 + 8 + 8 + 8
        // claim flag
        + 1;
}