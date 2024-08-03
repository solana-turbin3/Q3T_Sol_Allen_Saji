// ./enroll.ts

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs/wba_prereq";
import wallet from "./wba-wallet.json";

// Import your keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Github account
const github = Buffer.from("Allen-Saji", "utf8");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed"});

// Program address
const programId = new PublicKey("WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq");

// Create our program
const program = new Program<WbaPrereq>(IDL,provider);

// Define the seeds for the PDA
const enrollment_seeds = [Buffer.from("prereq"),
  keypair.publicKey.toBuffer()];
  const [enrollment_key, _bump] =
  PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

console.log("PDA Address:", enrollment_key.toBase58());

// Execute our enrollment transaction
(async () => {
  try {
    const txhash = await program.methods
    .complete(github)
    .accounts({
    signer: keypair.publicKey,
    })
    .signers([
    keypair
    ]).rpc();
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
    console.error(`Oops, something went wrong: ${e}`)
    }
    })();
