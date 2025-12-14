#![allow(deprecated)]
#![allow(unused_attributes)]

use anchor_lang::prelude::*;

declare_id!("DJzMFANyRmYriK61eXx7CkSUfHhmXsyTnHzWmxhRAQt9");

pub mod states;
pub mod instructions;
pub mod errors;

pub use instructions::*;

#[program]
pub mod game_prediction {
    use super::*;

    pub fn create_pool(
        ctx: Context<CreatePool>,
        player_a: Pubkey,
        player_b: Pubkey,
        match_id: Pubkey,
    ) -> Result<()> {
        instructions::create_pool::handler(ctx, player_a, player_b, match_id)?;
        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        side: u8,      // 1=A, 2=B
        amount: u64,
    ) -> Result<()> {
        instructions::place_bet::handler(ctx, side, amount)?;
        Ok(())
    }

    pub fn close_pool(ctx: Context<ClosePool>) -> Result<()> {
        instructions::close_pool::handler(ctx)?;
        Ok(())
    }

    pub fn settle_pool(
        ctx: Context<SettlePool>,
        result: u8,            // 1 = A wins, 2 = B wins
        fee_bps: u16,          // e.g., 200 = 2%
        player_share_bps: u16, // e.g., 1000 = 10%
    ) -> Result<()> {
        instructions::settle_pool::handler(ctx, result, fee_bps, player_share_bps)?;
        Ok(())
    }

    pub fn claim_spectator_winnings(
        ctx: Context<ClaimSpectatorWinnings>,
    ) -> Result<()> {
        instructions::claim_spectator_winnings::handler(ctx)?;
        Ok(())
    }

    pub fn claim_player_prize(
    ctx: Context<ClaimPlayerPrize>,
) -> Result<()> {
    instructions::claim_player_prize::handler(ctx)?;
    Ok(())
}

}