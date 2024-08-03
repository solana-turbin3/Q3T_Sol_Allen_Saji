import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    Metadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";


// Define our Mint address
const mint = publicKey("8VSR2RVcRuDP9dxYxymTwoyHyqEFs7mbWG7f5mUBWLaq");

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
    try {

        // Define the accounts required for the instruction
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: keypair.publicKey
        };

        // Define the data for the metadata
        let data: DataV2Args = {
            name: "Saji Token",
            symbol: "$T",
            uri: "", 
            sellerFeeBasisPoints: 0, // No seller fee
            creators: null ,
            collection: null,
            uses: null
        };

        // Define the args for the instruction
        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        };

        // Create the transaction
        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        );

        // Send and confirm the transaction
        let result = await tx.sendAndConfirm(umi).then(r => r.signature.toString());
        console.log(`Transaction signature: ${result}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();
