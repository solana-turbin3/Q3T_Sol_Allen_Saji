import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { expect } from "chai";
import { NfTickets } from "../target/types/nf_tickets";
import { fetchCollectionV1 } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

// Use the RPC endpoint of your choice.
const umi = createUmi("http://127.0.0.1:8899").use(mplCore());

describe("nf-tickets", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NfTickets as Program<NfTickets>;

  const platformName = "TestPlatform";
  const fee = 250; // 2.5%

  const [platformPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("platform"), Buffer.from(platformName)],
    program.programId
  );

  it("Initializes the platform", async () => {
    const tx = await program.methods
      .initialize(platformName, fee)
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Fetch the platform account to verify initialization
    const platformAccount = await program.account.platform.fetch(platformPda);

    // Assert the correct values were set
    expect(platformAccount.admin.toString()).to.equal(
      provider.wallet.publicKey.toString()
    );
    expect(platformAccount.fee).to.equal(fee);
    expect(platformAccount.platformName).to.equal(platformName);
    expect(platformAccount.bump).to.be.greaterThan(0);
    expect(platformAccount.treasuryBump).to.be.greaterThan(0);
    expect(platformAccount.rewardsBump).to.be.greaterThan(0);
  });

  it("Initializes the manager", async () => {
    const [managerPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("manager"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods.setupManager().accounts({}).rpc();
    const methods = await program.methods;

    // Fetch the manager account to verify initialization
    const managerAccount = await program.account.manager.fetch(managerPda);
    console.log(managerAccount);
  });

  it("Creates an event", async () => {
    // Generate a new keypair for the event
    const eventKeypair = anchor.web3.Keypair.generate();

    // Define event details
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

    const tx = await program.methods
      .createEvent(eventArgs)
      .accounts({
        event: eventKeypair.publicKey,
      })
      .signers([eventKeypair])
      .rpc();

    console.log(tx);

    // Add more assertions as needed
  });

  it("Scans a ticket", async () => {
    // Test implementation for scanning a ticket
  });
});
