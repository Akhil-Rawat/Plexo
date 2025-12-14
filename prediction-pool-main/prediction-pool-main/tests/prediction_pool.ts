import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { GamePrediction } from "../target/types/game_prediction";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  createMint, 
  createAccount, 
  mintTo,
  getAccount 
} from "@solana/spl-token";
import { assert } from "chai";

describe("game_prediction", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GamePrediction as Program<GamePrediction>;

  const admin = provider.wallet;
  const playerA = Keypair.generate(); // Changed to keypair
  const playerB = Keypair.generate(); // Changed to keypair
  const bettor = Keypair.generate();

  let tokenMint: PublicKey;
  let vault: PublicKey;
  let feeTreasury: PublicKey;
  let playerPrizeVault: PublicKey;
  let poolPda: PublicKey;
  let matchId: PublicKey;
  let bettorAta: PublicKey;
  let betPda: PublicKey;

  before(async () => {
    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      admin.payer,
      admin.publicKey,
      null,
      6
    );

    // Fund players and bettor with SOL
    for (const kp of [playerA, playerB, bettor]) {
      const airdropSig = await provider.connection.requestAirdrop(
        kp.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);
    }

    // Create bettor's ATA and fund it
    bettorAta = await createAccount(
      provider.connection,
      admin.payer,
      tokenMint,
      bettor.publicKey
    );

    await mintTo(
      provider.connection,
      admin.payer,
      tokenMint,
      bettorAta,
      admin.publicKey,
      1_000_000_000 // 1000 tokens
    );

    // Create fee treasury
    feeTreasury = await createAccount(
      provider.connection,
      admin.payer,
      tokenMint,
      admin.publicKey
    );
  });

  it("Creates a pool", async () => {
    matchId = Keypair.generate().publicKey;

    [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), matchId.toBuffer()],
      program.programId
    );

    // Vault uses pool address as seed (after pool is derived)
    [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), poolPda.toBuffer()],
      program.programId
    );

    [playerPrizeVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("player_prize_vault"), poolPda.toBuffer()],
      program.programId
    );

    await program.methods
      .createPool(playerA.publicKey, playerB.publicKey, matchId)
      .accounts({
        pool: poolPda,
        vault,
        playerPrizeVault,
        admin: admin.publicKey,
        tokenMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const pool = await program.account.pool.fetch(poolPda);
    assert.equal(pool.isOpen, true);
    assert.equal(pool.playerA.toBase58(), playerA.publicKey.toBase58());
    console.log("✓ Pool created");
  });

  it("Places a bet on Player A", async () => {
    [betPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), poolPda.toBuffer(), bettor.publicKey.toBuffer()],
      program.programId
    );

    const betAmount = new anchor.BN(100_000_000); // 100 tokens

    await program.methods
      .placeBet(1, betAmount)
      .accounts({
        pool: poolPda,
        vault,
        bettor: bettor.publicKey,
        bettorAta,
        bet: betPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([bettor])
      .rpc();

    const pool = await program.account.pool.fetch(poolPda);
    const bet = await program.account.bet.fetch(betPda);
    assert.equal(pool.totalForA.toString(), betAmount.toString());
    assert.equal(bet.side, 1);
    assert.equal(bet.amount.toString(), betAmount.toString());
    console.log("✓ Bet placed on Player A");
  });

  it("Closes the pool", async () => {
    await program.methods
      .closePool()
      .accounts({
        pool: poolPda,
        admin: admin.publicKey,
      })
      .rpc();

    const pool = await program.account.pool.fetch(poolPda);
    assert.equal(pool.isOpen, false);
    console.log("✓ Pool closed");
  });

  it("Settles pool with Player A winning", async () => {
    await program.methods
      .settlePool(1, 200, 1000) // A wins, 2% fee, 10% player prize
      .accounts({
        pool: poolPda,
        vault,
        feeTreasury,
        playerPrizeVault,
        admin: admin.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const pool = await program.account.pool.fetch(poolPda);
    assert.equal(pool.isSettled, true);
    assert.equal(pool.result, 1);
    assert.isTrue(pool.feeAmount.toNumber() > 0);
    assert.isTrue(pool.playerPrizeAmount.toNumber() > 0);
    console.log("✓ Pool settled - A wins!");
  });

  it("Bettor claims spectator winnings", async () => {
    const bettorBalanceBefore = await getAccount(provider.connection, bettorAta);
    
    await program.methods
      .claimSpectatorWinnings()
      .accounts({
        pool: poolPda,
        vault,
        bet: betPda,
        bettor: bettor.publicKey,
        bettorAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([bettor])
      .rpc();

    const bet = await program.account.bet.fetch(betPda);
    const bettorBalanceAfter = await getAccount(provider.connection, bettorAta);
    
    assert.equal(bet.claimed, true);
    assert.isTrue(
      Number(bettorBalanceAfter.amount) > Number(bettorBalanceBefore.amount),
      "Bettor should receive winnings"
    );
    console.log("✓ Spectator claimed winnings");
  });

  it("Player claims prize", async () => {
    // Create Player A's ATA for receiving prize
    const playerAta = await createAccount(
      provider.connection,
      admin.payer,
      tokenMint,
      playerA.publicKey
    );

    await program.methods
      .claimPlayerPrize()
      .accounts({
        pool: poolPda,
        playerPrizeVault,
        player: playerA.publicKey,
        playerAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([playerA])
      .rpc();

    const pool = await program.account.pool.fetch(poolPda);
    const playerBalance = await getAccount(provider.connection, playerAta);
    
    assert.equal(pool.playerPrizeClaimed, true);
    assert.isTrue(Number(playerBalance.amount) > 0);
    console.log("✓ Player claimed prize");
  });
});