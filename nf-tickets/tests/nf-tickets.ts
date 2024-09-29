import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { expect } from "chai";
import { NfTickets } from "../target/types/nf_tickets";
import { fetchCollectionV1, fetchAssetV1 } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

// Initialize the UMI object for interacting with Metaplex programs
const umi = createUmi("http://127.0.0.1:8899").use(mplCore());

describe("nf-tickets", () => {
  // Set up the anchor provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Load the NfTickets program
  const program = anchor.workspace.NfTickets as Program<NfTickets>;

  // Define global constants and variables
  const platformName = "TestPlatform";
  const fee = 250; // Platform fee in basis points (2.5%)
  let platformPda: anchor.web3.PublicKey;
  let rewardsMintPda: anchor.web3.PublicKey;
  let treasuryPda: anchor.web3.PublicKey;
  let managerPda: anchor.web3.PublicKey;
  let eventKeypair: anchor.web3.Keypair;

  // Test 1: Initializing the platform
  it("Initializes platform", async () => {
    // Find PDAs for platform, rewards, and treasury
    [platformPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("platform"), Buffer.from(platformName)],
      program.programId
    );

    [rewardsMintPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("rewards"), platformPda.toBuffer()],
      program.programId
    );

    [treasuryPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), platformPda.toBuffer()],
      program.programId
    );

    // Call the initialize method in the program
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

    // Fetch the platform account and verify its data
    const platformAccount = await program.account.platform.fetch(platformPda);
    expect(platformAccount.admin.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
    expect(platformAccount.fee).to.equal(fee);
    expect(platformAccount.platformName).to.equal(platformName);
  });

  // Test 2: Setting up the manager
  it("Sets up manager", async () => {
    // Derive PDA for the manager
    [managerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("manager"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    // Call setupManager method from the program
    await program.methods.setupManager().accounts({}).rpc();

    // Fetch and validate the manager account
    const managerAccount = await program.account.manager.fetch(managerPda);
    expect(managerAccount).to.exist;
  });

  // Test 3: Creating an event
  it("Creates an event", async () => {
    // Generate keypair for the new event
    eventKeypair = anchor.web3.Keypair.generate();
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

    // Call createEvent method from the program
    const eventTx = await program.methods
      .createEvent(eventArgs)
      .accountsPartial({
        signer: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        manager: managerPda,
        event: eventKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .signers([eventKeypair])
      .rpc();

    // Confirm the transaction
    await provider.connection.confirmTransaction(eventTx);

    // Fetch and validate the event collection
    const collection = await fetchCollectionWithRetry(eventKeypair.publicKey);
    expect(collection.name).to.equal(eventArgs.name);
    console.log("Event collection: ", collection);
  });

  it("Generates a ticket", async () => {
    // Generate keypair for the new ticket
    const ticketKeypair = anchor.web3.Keypair.generate();
    const venueAuthority = anchor.web3.Keypair.generate().publicKey;

    const ticketArgs = {
      name: "Test Ticket",
      uri: "https://example.com/ticket",
      price: new anchor.BN(10000),
      venueAuthority,
      screen: "Screen 1",
      row: "A",
      seat: "1",
    };

    try {
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

      console.log("Transaction sent. Waiting for confirmation...");
      console.log("Transaction signature:", ticketTx);

      // Confirm the transaction
      await provider.connection.confirmTransaction(ticketTx);

      console.log("Transaction confirmed. Fetching ticket...");

      // Fetch and validate the ticket
      const ticket = await fetchTicketWithRetry(ticketKeypair.publicKey);
      expect(ticket.name).to.equal(ticketArgs.name);
      console.log("Ticket created successfully:", ticket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      if (error instanceof anchor.AnchorError) {
        console.error("Error code:", error.error.errorCode.code);
        console.error("Error message:", error.error.errorMessage);
        console.error("Error logs:", error.logs);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  });
  // Helper function: Retry fetching a collection
  const fetchCollectionWithRetry = async (
    eventPublicKey: anchor.web3.PublicKey,
    retries = 50,
    delay = 2000
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetchCollectionV1(
          umi,
          publicKey(eventPublicKey.toBase58())
        );
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  // Helper function: Retry fetching a ticket
  const fetchTicketWithRetry = async (
    ticketPublicKey: anchor.web3.PublicKey,
    retries = 50,
    delay = 2000
  ) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetchAssetV1(umi, publicKey(ticketPublicKey.toBase58()));
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };
});
