use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    /// The bettor who placed the bet
    pub bettor: Pubkey,

    /// Amount of tokens the user bet
    pub amount: u64,

    /// The side they bet on (1 = Player A, 2 = Player B)
    pub side: u8,

    /// The pool this bet belongs to
    pub pool: Pubkey,

    /// Whether winnings have been claimed
    pub claimed: bool,

    /// Bump for PDA
    pub bump: u8,
}

impl Bet {
    pub const SPACE: usize = 
        32  // bettor
        + 8   // amount
        + 1   // side
        + 32  // pool
        + 1   // claimed
        + 1;  // bump
}