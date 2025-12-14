use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Betting is closed.")]
    PoolClosed,
    #[msg("Invalid side.")]
    InvalidSide,
    #[msg("Cannot switch bet sides.")]
    CannotSwitchSides,
    #[msg("Pool is already closed.")]
    PoolAlreadyClosed,
    #[msg("Invalid match result.")]
    InvalidResult,
    #[msg("Pool is still open.")]
    PoolStillOpen,
    #[msg("Pool already settled.")]
    PoolAlreadySettled,
    #[msg("No one bet on the winning side.")]
    NoBetsOnWinner,
    #[msg("Not the winning player.")]
    NotWinningPlayer,
    #[msg("Pool is not settled.")]
    PoolNotSettled,
    #[msg("You did not bet on the winning side.")]
    NotWinner,
    #[msg("You already claimed.")]
    AlreadyClaimed,
    #[msg("Nothing to claim.")]
    NothingToClaim,
}
