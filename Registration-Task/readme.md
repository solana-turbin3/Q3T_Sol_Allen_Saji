### Prerequisites: Enrollment dApp

This file outlines the steps to complete the prerequisites for the WBA Enrollment dApp. It involves setting up a Solana development environment, creating and managing Solana wallets, and performing basic transactions. These steps are designed to assess the ability to follow processes, execute tasks, debug errors, and ship code.

#### Steps:

1. **Create a new Keypair**
   - **Setting up**
     - Open Terminal.
     - Initialize a new Rust library using Cargo:
       ```sh
       cargo init --lib
       ```
     - Add `solana-sdk` to `Cargo.toml`:
       ```toml
       [dependencies]
       solana-sdk = "1.15.2"
       ```
     - Create functions in `src/lib.rs` for the scripts:
       ```rust
       #[cfg(test)]
       mod tests {
           use solana_sdk;
           #[test]
           fn keygen() {}
           #[test]
           fn airdrop() {}
           #[test]
           fn transfer_sol() {}
       }
       ```
   - **Generating a Keypair**
     - Generate a new Solana keypair.
     - Save the keypair in a JSON file.

2. **Import/Export to Phantom**
   - **Conversion Functions**
     - Add `bs58` to `Cargo.toml`.
     - Create convenience functions to convert between wallet formats.

3. **Claim Token Airdrop**
   - **Import and Setup**
     - Add `solana_client` to `Cargo.toml`.
     - Import Keypair, Connection, and LAMPORTS_PER_SOL.
     - Recreate the Keypair object using its private key.
     - Establish a connection to the Solana devnet.
     - Claim 2 devnet SOL tokens and log the transaction.

4. **Transfer Tokens to WBA Address**
   - **Setup Transfer**
     - Add `solana-program` to `Cargo.toml`.
     - Import necessary modules and the dev wallet.
     - Define the WBA public key.
     - Create a devnet connection.
   - **Execute Transfer**
     - Create a transaction to transfer 0.1 SOL.
     - Sign, broadcast, and confirm the transaction.

5. **Empty devnet wallet into WBA wallet**
   - **Calculate Fees and Transfer Remaining Balance**
     - Import `Message` from `solana_sdk`.
     - Get the balance of the dev wallet.
     - Calculate the transaction fee.
     - Transfer all remaining lamports minus the fee to the WBA wallet.
     - Sign, broadcast, and confirm the transaction.

6. **Submit your completion of the WBA prerequisites program**
   - **Understanding PDA and IDL**
     - Learn about Program Derived Addresses (PDA) and Interface Definition Language (IDL).
   - **Consuming an IDL in Rust**
     - Add `borsh` and `solana-idlgen` to `Cargo.toml`.
     - Create a `programs` folder in the `src` directory.
     - Create `mod.rs` and `wba_prereq.rs` files.
     - Declare the `wba_prereq` module in `mod.rs`.
     - Use the `idlgen` macro to consume the IDL in `wba_prereq.rs`.
     - Populate the optional metadata fields of the IDL.
     - Import the generated structs and methods in `lib.rs`.

