use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::states::Pool;
use crate::errors::ErrorCode;


#[derive(Accounts)]
pub struct SettlePool<'info> {
    #[account(
        mut,
        has_one = vault,     
        constraint = !pool.is_settled @ ErrorCode::PoolAlreadySettled,
        constraint = !pool.is_open @ ErrorCode::PoolStillOpen
    )]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,

    // Fee treasury (protocol revenue)
    #[account(mut)]
    pub fee_treasury: Account<'info, TokenAccount>,

    // Player prize vault (winner will claim later)
    #[account(mut)]
    pub player_prize_vault: Account<'info, TokenAccount>,

    // Admin/oracle signs to set the result
    pub admin: Signer<'info>,

    // Programs
    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<SettlePool>,
    result: u8,           // 1=A wins, 2=B wins
    fee_bps: u16,         // e.g. 200 = 2%
    player_share_bps: u16 // e.g. 1000 = 10%
) -> Result<()> {

    // ----------------------------
    // 0. Validate result & extract data we need
    // ----------------------------
    require!(result == 1 || result == 2, ErrorCode::InvalidResult);

    // Extract values BEFORE taking mutable reference
    let match_id = ctx.accounts.pool.match_id;
    let bump = ctx.accounts.pool.bump;
    let total_for_a = ctx.accounts.pool.total_for_a;
    let total_for_b = ctx.accounts.pool.total_for_b;

    // ----------------------------
    // 1. Compute total pool
    // ----------------------------
    let total_pool = (total_for_a as u128)
        .checked_add(total_for_b as u128)
        .unwrap();

    // ----------------------------
    // 2. Compute fee & player prize
    // ----------------------------
    let fee_amount = total_pool
        .checked_mul(fee_bps as u128).unwrap()
        .checked_div(10_000).unwrap();

    let player_prize = total_pool
        .checked_mul(player_share_bps as u128).unwrap()
        .checked_div(10_000).unwrap();

    // ----------------------------
    // 3. Distributable to bettors
    // ----------------------------
    let distributable = total_pool
        .checked_sub(fee_amount).unwrap()
        .checked_sub(player_prize).unwrap();

    // ----------------------------
    // 4. Winner total
    // ----------------------------
    let winner_pool = match result {
        1 => total_for_a as u128,
        2 => total_for_b as u128,
        _ => unreachable!(),
    };

    require!(winner_pool > 0, ErrorCode::NoBetsOnWinner);

    // Convert to u64 for storage
    let fee_amount_u64 = fee_amount as u64;
    let player_prize_u64 = player_prize as u64;
    let distributable_u64 = distributable as u64;
    let winner_pool_u64 = winner_pool as u64;

    // ----------------------------
    // 5. Move fee to treasury vault
    // ----------------------------
    let pool_seeds = &[
        b"pool",
        match_id.as_ref(),
        &[bump],
    ];
    let signer_seeds = &[&pool_seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.fee_treasury.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            },
            signer_seeds,
        ),
        fee_amount_u64,
    )?;

    // ----------------------------
    // 6. Move player prize to prize vault
    // ----------------------------
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.player_prize_vault.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            },
            signer_seeds,
        ),
        player_prize_u64,
    )?;

    // ----------------------------
    // 7. NOW update pool state (after all CPI calls)
    // ----------------------------
    let pool = &mut ctx.accounts.pool;
    pool.result = result;
    pool.fee_amount = fee_amount_u64;
    pool.player_prize_amount = player_prize_u64;
    pool.distributable = distributable_u64;
    pool.winner_pool = winner_pool_u64;
    pool.is_settled = true;

    Ok(())
}