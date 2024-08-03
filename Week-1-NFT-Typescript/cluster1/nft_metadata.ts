import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    const image =
      "https://arweave.net/gCEBEtshoh6TkHDVvJhgt9NpoQWs1bKX_iATqzJpCgg";

    const metadata = {
      name: "Generug",
      symbol: "GENRUG",
      description:
        "Generug is a unique NFT artwork symbolizing the intersection of generative art and the idea of a 'rug pull'. It captures the essence of creativity and caution in the NFT space.",
      image,
      attributes: [
        { trait_type: "Background", value: "Abstract" },
        { trait_type: "Pattern", value: "Generative" },
        { trait_type: "Theme", value: "Rug Pull" },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
        category: "image",
        creators: [
          {
            address: keypair.publicKey.toString(),
            share: 100,
          },
        ],
      },
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
