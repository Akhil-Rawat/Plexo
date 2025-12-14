use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::errors::ErrorCode;
use crate::states::*;

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut, has_one = vault)]
    pub pool: Account<'info, Pool>,

    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub bettor: Signer<'info>,

    #[account(
        mut,
        constraint = bettor_ata.owner == bettor.key(),
        constraint = bettor_ata.mint == pool.token_mint
    )]
    pub bettor_ata: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = bettor,
        space = 8 + Bet::SPACE,
        seeds = [b"bet", pool.key().as_ref(), bettor.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<PlaceBet>,
    side: u8,
    amount: u64,
) -> Result<()> {

    let pool = &mut ctx.accounts.pool;
    let bet = &mut ctx.accounts.bet;

    require!(pool.is_open, ErrorCode::PoolClosed);

    require!(side == 1 || side == 2, ErrorCode::InvalidSide);

    if bet.amount > 0 {
        require!(bet.side == side, ErrorCode::CannotSwitchSides);
    } else {
        bet.side = side;
        bet.pool = pool.key();
        bet.bettor = ctx.accounts.bettor.key();
        bet.claimed = false;
    }

    if side == 1 {
        pool.total_for_a = pool.total_for_a.checked_add(amount).unwrap();
    } else {
        pool.total_for_b = pool.total_for_b.checked_add(amount).unwrap();
    }

    bet.amount = bet.amount.checked_add(amount).unwrap();

    let cpi_accounts = Transfer {
        from: ctx.accounts.bettor_ata.to_account_info(),
        to: ctx.accounts.vault.to_account_info(),
        authority: ctx.accounts.bettor.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    Ok(())
}
