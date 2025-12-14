use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::states::Pool;

#[derive(Accounts)]
#[instruction(player_a: Pubkey, player_b: Pubkey, match_id: Pubkey)]
pub struct CreatePool<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Pool::SPACE,
        seeds = [b"pool", match_id.as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    // vault seeds use pool account after it's derived from match_id
    #[account(
        init,
        payer = admin,
        token::mint = token_mint,
        token::authority = pool,
        seeds = [b"vault", pool.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = admin,
        token::mint = token_mint,
        token::authority = pool,
        seeds = [b"player_prize_vault", pool.key().as_ref()],
        bump
    )]
    pub player_prize_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreatePool>,
    player_a: Pubkey,
    player_b: Pubkey,
    match_id: Pubkey,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    pool.player_a = player_a;
    pool.player_b = player_b;
    pool.match_id = match_id;
    pool.admin = ctx.accounts.admin.key();

    pool.token_mint = ctx.accounts.token_mint.key();

    pool.total_for_a = 0;
    pool.total_for_b = 0;

    pool.is_open = true;
    pool.is_settled = false;
    pool.result = 0;

    pool.vault = ctx.accounts.vault.key();
    pool.player_prize_vault = ctx.accounts.player_prize_vault.key();

    pool.bump = ctx.bumps.pool;
    pool.vault_bump = ctx.bumps.vault;
    pool.player_prize_vault_bump = ctx.bumps.player_prize_vault;

    pool.player_prize_claimed = false;

    // Initialize settlement fields
    pool.winner_pool = 0;
    pool.distributable = 0;
    pool.fee_amount = 0;
    pool.player_prize_amount = 0;

    Ok(())
}