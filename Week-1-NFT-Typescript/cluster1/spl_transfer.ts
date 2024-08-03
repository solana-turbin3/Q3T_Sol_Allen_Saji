import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("8VSR2RVcRuDP9dxYxymTwoyHyqEFs7mbWG7f5mUBWLaq");

// Recipient address
const to = new PublicKey("DuDv24gAdH9T15nsJwqpAX9hJyeFpaxEzPzCDDvgCmWM");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata_sender = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ata_receiver = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        // Transfer the new token to the "toTokenAccount" we just created
        const result = await transfer(connection, keypair, ata_sender.address, ata_receiver.address, keypair.publicKey, 1_000_000_000);
        console.log(result)  
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();