import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        // Create a new mint with 9 decimals
        const mint = await createMint(
            connection,         // Connection to the Solana blockchain
            keypair,            // Payer of the transaction
            keypair.publicKey,  // Mint authority
            null,               // Freeze authority (optional, can be null)
            9                   // Number of decimals for the token
        );

        // Print the mint address
        console.log(`Mint created: ${mint.toBase58()}`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();
