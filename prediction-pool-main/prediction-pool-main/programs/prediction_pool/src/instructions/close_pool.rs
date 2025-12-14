use anchor_lang::prelude::*;
use crate::states::Pool;
use crate::errors::ErrorCode;

#[derive(Accounts)]
pub struct ClosePool<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    pub admin: Signer<'info>,
}

pub fn handler(ctx: Context<ClosePool>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    require!(pool.is_open, ErrorCode::PoolAlreadyClosed);
    pool.is_open = false;

    Ok(())
}