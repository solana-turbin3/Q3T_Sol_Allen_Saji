import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { expect } from "chai";
import { NfTickets } from "../target/types/nf_tickets";
import { fetchCollectionV1, fetchAssetV1 } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

const umi = createUmi("http://127.0.0.1:8899").use(mplCore());

describe("nf-tickets", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NfTickets as Program<NfTickets>;

  const platformName = "TestPlatform";
  const fee = 250; // 2.5%

  it("Initializes platform, sets up manager, creates event, and generates ticket", async () => {
    // Platform initialization
    const [platformPda, platformBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("platform"), Buffer.from(platformName)],
        program.programId
      );

    const [rewardsMintPda, rewardsBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("rewards"), platformPda.toBuffer()],
        program.programId
      );

    const [treasuryPda, treasuryBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("treasury"), platformPda.toBuffer()],
        program.programId
      );

    await program.methods
      .initialize(platformName, fee)
      .accountsPartial({
        admin: provider.wallet.publicKey,
        platform: platformPda,
        rewardsMint: rewardsMintPda,
        treasury: treasuryPda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const platformAccount = await program.account.platform.fetch(platformPda);
    expect(platformAccount.admin.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
    expect(platformAccount.fee).to.equal(fee);
    expect(platformAccount.platformName).to.equal(platformName);
    expect(platformAccount.bump).to.equal(platformBump);
    expect(platformAccount.treasuryBump).to.equal(treasuryBump);
    expect(platformAccount.rewardsBump).to.equal(rewardsBump);
    console.log("Platform account: ", platformAccount);

    // Manager setup
    const [managerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("manager"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods.setupManager().accounts({}).rpc();
    const managerAccount = await program.account.manager.fetch(managerPda);
    console.log("Manager account:", managerAccount);

    // Event creation
    const eventKeypair = anchor.web3.Keypair.generate();
    const eventArgs = {
      name: "Test Event",
      category: "Music",
      uri: "https://example.com/event",
      city: "Test City",
      venue: "Test Venue",
      artist: "Test Artist",
      date: "2024-10-01",
      time: "20:00",
      capacity: 1,
      isTicketTransferable: true,
    };

    const eventTx = await program.methods
      .createEvent(eventArgs)
      .accountsPartial({
        signer: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        manager: managerPda,
        event: eventKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([eventKeypair])
      .rpc();

    await provider.connection.confirmTransaction(eventTx);

    // Fetch collection with retry
    const fetchCollectionWithRetry = async (retries = 50, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fetchCollectionV1(
            umi,
            publicKey(eventKeypair.publicKey.toBase58())
          );
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    const collection = await fetchCollectionWithRetry();
    expect(collection.name).to.equal(eventArgs.name);
    expect(collection.uri).to.equal(eventArgs.uri);
    console.log("Event: ", collection);

    // Ticket generation
    const ticketKeypair = anchor.web3.Keypair.generate();
    const venueAuthority = anchor.web3.Keypair.generate().publicKey;
    const ticketArgs = {
      name: "Test Ticket",
      uri: "https://example.com/ticket",
      price: new anchor.BN(10000),
      venueAuthority: venueAuthority,
      screen: "Screen 1",
      row: "A",
      seat: "1",
    };

    console.log("about to transact");
    const ticketTx = await program.methods
      .createTicket(ticketArgs)
      .accountsPartial({
        signer: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        manager: managerPda,
        platform: platformPda,
        event: eventKeypair.publicKey,
        ticket: ticketKeypair.publicKey,
        treasury: treasuryPda,
        systemProgram: anchor.web3.SystemProgram.programId,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .signers([ticketKeypair])
      .rpc();

    console.log("Ticket txn: ", ticketTx);
    await provider.connection.confirmTransaction(ticketTx);

    // Fetch ticket with retry
    const fetchTicketWithRetry = async (retries = 50, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fetchAssetV1(
            umi,
            publicKey(ticketKeypair.publicKey.toBase58())
          );
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    };

    const ticket = await fetchTicketWithRetry();
    expect(ticket.name).to.equal(ticketArgs.name);
    expect(ticket.uri).to.equal(ticketArgs.uri);
    console.log("Ticket: ", ticket);

    console.log("All operations completed successfully");
  });
});
