use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::errors::ErrorCode;
use crate::states::Pool;

#[derive(Accounts)]
pub struct ClaimPlayerPrize<'info> {
    #[account(
        mut,
        constraint = pool.is_settled @ ErrorCode::PoolNotSettled,
        has_one = player_prize_vault
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub player_prize_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        constraint = player_ata.owner == player.key(),
        constraint = player_ata.mint == pool.token_mint
    )]
    pub player_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimPlayerPrize>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    let player = ctx.accounts.player.key();

    // 1. Ensure correct winning player
    match pool.result {
        1 => require!(player == pool.player_a, ErrorCode::NotWinningPlayer),
        2 => require!(player == pool.player_b, ErrorCode::NotWinningPlayer),
        _ => return err!(ErrorCode::InvalidResult),
    }

    // 2. Ensure not claimed already
    require!(!pool.player_prize_claimed, ErrorCode::AlreadyClaimed);

    // 3. PDA signer seeds
    let seeds = &[
        b"pool",
        pool.match_id.as_ref(),
        &[pool.bump],
    ];
    let signer = &[&seeds[..]];

    // 4. Transfer prize tokens
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.player_prize_vault.to_account_info(),
                to: ctx.accounts.player_ata.to_account_info(),
                authority: pool.to_account_info(),
            },
            signer,
        ),
        pool.player_prize_amount,
    )?;

    // 5. Mark claimed
    pool.player_prize_claimed = true;

    Ok(())
}