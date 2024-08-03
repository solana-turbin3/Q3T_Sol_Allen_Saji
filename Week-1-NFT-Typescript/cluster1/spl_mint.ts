import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define the number of decimals for the token
const token_decimals = 1_000_000_000n;

// Mint address
const mint = new PublicKey("8VSR2RVcRuDP9dxYxymTwoyHyqEFs7mbWG7f5mUBWLaq");

(async () => {
    try {
        // Create an Associated Token Account (ATA)
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,        // Connection to the Solana blockchain
            keypair,           // Payer of the transaction
            mint,              // Mint for which the ATA is being created
            keypair.publicKey  // Owner of the ATA
        );
        console.log(`Your ATA is: ${ata.address.toBase58()}`);

        // Mint tokens to the ATA
        const mintTx = await mintTo(
            connection,        // Connection to the Solana blockchain
            keypair,           // Payer of the transaction
            mint,              // Mint of the token being minted
            ata.address,       // Destination address (ATA)
            keypair.publicKey, // Authority to mint tokens
            token_decimals     // Amount of tokens to mint (considering decimals)
        );
        console.log(`Your mint txid: ${mintTx}`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`);
    }
})();
