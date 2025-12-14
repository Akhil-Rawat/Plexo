/**
 * Prediction Pool Solana Program Client
 * Integrates the prediction_pool Anchor program with Plexo frontend
 */

import { AnchorProvider, Program, web3, BN, Idl } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Connection } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import IDL from "./idl/game_prediction.json";

const PROGRAM_ID = new PublicKey(
  "DJzMFANyRmYriK61eXx7CkSUfHhmXsyTnHzWmxhRAQt9"
);

export class PredictionPoolClient {
  program: Program;
  provider: AnchorProvider;

  constructor(connection: Connection, wallet: any) {
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    this.program = new Program(IDL as Idl, PROGRAM_ID, this.provider);
  }

  /**
   * Derive Pool PDA from match ID
   */
  getPoolPda(matchId: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), matchId.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Derive Vault PDA from pool
   */
  getVaultPda(poolPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), poolPda.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Derive Player Prize Vault PDA from pool
   */
  getPlayerPrizeVaultPda(poolPda: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("player_prize_vault"), poolPda.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Derive Bet PDA from pool and bettor
   */
  getBetPda(poolPda: PublicKey, bettor: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), poolPda.toBuffer(), bettor.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Create a new prediction pool for a match
   */
  async createPool(
    playerA: PublicKey,
    playerB: PublicKey,
    matchId: PublicKey,
    tokenMint: PublicKey
  ) {
    const [poolPda] = this.getPoolPda(matchId);
    const [vault] = this.getVaultPda(poolPda);
    const [playerPrizeVault] = this.getPlayerPrizeVaultPda(poolPda);

    const tx = await this.program.methods
      .createPool(playerA, playerB, matchId)
      .accounts({
        pool: poolPda,
        vault,
        playerPrizeVault,
        admin: this.provider.wallet.publicKey,
        tokenMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    return {
      txSignature: tx,
      poolPda: poolPda.toBase58(),
      vault: vault.toBase58(),
    };
  }

  /**
   * Place a bet on a match
   * @param poolPda - The pool PDA
   * @param side - 1 for Player A, 2 for Player B
   * @param amount - Amount in lamports
   * @param bettorAta - Bettor's token account
   */
  async placeBet(
    poolPda: PublicKey,
    side: number,
    amount: number,
    bettorAta: PublicKey
  ) {
    const [vault] = this.getVaultPda(poolPda);
    const [betPda] = this.getBetPda(poolPda, this.provider.wallet.publicKey);

    const tx = await this.program.methods
      .placeBet(side, new BN(amount))
      .accounts({
        pool: poolPda,
        vault,
        bettor: this.provider.wallet.publicKey,
        bettorAta,
        bet: betPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return {
      txSignature: tx,
      betPda: betPda.toBase58(),
    };
  }

  /**
   * Close the pool (stop accepting bets)
   */
  async closePool(poolPda: PublicKey) {
    const tx = await this.program.methods
      .closePool()
      .accounts({
        pool: poolPda,
        admin: this.provider.wallet.publicKey,
      })
      .rpc();

    return { txSignature: tx };
  }

  /**
   * Settle the pool with match result
   * @param poolPda - The pool PDA
   * @param result - 1 for Player A wins, 2 for Player B wins
   * @param feeBps - Fee in basis points (e.g., 200 = 2%)
   * @param playerShareBps - Player prize share in basis points (e.g., 1000 = 10%)
   * @param feeTreasury - Treasury account for fees
   */
  async settlePool(
    poolPda: PublicKey,
    result: number,
    feeBps: number,
    playerShareBps: number,
    feeTreasury: PublicKey
  ) {
    const [vault] = this.getVaultPda(poolPda);
    const [playerPrizeVault] = this.getPlayerPrizeVaultPda(poolPda);

    const tx = await this.program.methods
      .settlePool(result, feeBps, playerShareBps)
      .accounts({
        pool: poolPda,
        vault,
        feeTreasury,
        playerPrizeVault,
        admin: this.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return { txSignature: tx };
  }

  /**
   * Claim spectator winnings
   */
  async claimSpectatorWinnings(poolPda: PublicKey, bettorAta: PublicKey) {
    const [vault] = this.getVaultPda(poolPda);
    const [betPda] = this.getBetPda(poolPda, this.provider.wallet.publicKey);

    const tx = await this.program.methods
      .claimSpectatorWinnings()
      .accounts({
        pool: poolPda,
        vault,
        bet: betPda,
        bettor: this.provider.wallet.publicKey,
        bettorAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return { txSignature: tx };
  }

  /**
   * Claim player prize (for winning player)
   */
  async claimPlayerPrize(
    poolPda: PublicKey,
    playerAta: PublicKey,
    player: PublicKey
  ) {
    const [playerPrizeVault] = this.getPlayerPrizeVaultPda(poolPda);

    const tx = await this.program.methods
      .claimPlayerPrize()
      .accounts({
        pool: poolPda,
        playerPrizeVault,
        player,
        playerAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return { txSignature: tx };
  }

  /**
   * Fetch pool account data
   */
  async getPool(poolPda: PublicKey) {
    return await this.program.account.pool.fetch(poolPda);
  }

  /**
   * Fetch bet account data
   */
  async getBet(betPda: PublicKey) {
    return await this.program.account.bet.fetch(betPda);
  }
}
