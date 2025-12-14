use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::errors::ErrorCode;
use crate::states::*;


#[derive(Accounts)]
pub struct ClaimSpectatorWinnings<'info> {
    #[account(
        mut,
        constraint = pool.is_settled @ ErrorCode::PoolNotSettled,
        has_one = vault
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = bet.pool == pool.key(),
        constraint = bet.bettor == bettor.key(),
        constraint = !bet.claimed @ ErrorCode::AlreadyClaimed
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub bettor: Signer<'info>,
    

    #[account(
        mut,
        constraint = bettor_ata.owner == bettor.key(),
        constraint = bettor_ata.mint == pool.token_mint
    )]
    pub bettor_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<ClaimSpectatorWinnings>
) -> Result<()> {
    let pool = &ctx.accounts.pool;
    let bet = &mut ctx.accounts.bet;

    // ----------------------------------
    // 1. Must be winner
    // ----------------------------------
    require!(bet.side == pool.result, ErrorCode::NotWinner);

    // ----------------------------------
    // 2. Calculate payout
    // payout = bet.amount / winner_pool * distributable
    // ----------------------------------
    let payout = (bet.amount as u128)
        .checked_mul(pool.distributable as u128).unwrap()
        .checked_div(pool.winner_pool as u128).unwrap() as u64;

    require!(payout > 0, ErrorCode::NothingToClaim);

    // ----------------------------------
    // 3. Transfer payout from vault → bettor
    // ----------------------------------
    let seeds = &[
        b"pool",
        pool.match_id.as_ref(),
        &[pool.bump],
    ];
    let signer = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.bettor_ata.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            },
            signer,
        ),
        payout,
    )?;

    // ----------------------------------
    // 4. Mark bet as claimed
    // ----------------------------------
    bet.claimed = true;

    Ok(())
}