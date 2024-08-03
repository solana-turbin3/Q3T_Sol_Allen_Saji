### Prerequisites: Enrollment dApp

This file outlines the steps to complete the prerequisites for the WBA Enrollment dApp. It involves setting up a Solana development environment, creating and managing Solana wallets, and performing basic transactions. These steps are designed to assess the ability to follow processes, execute tasks, debug errors, and ship code.

#### Steps:

1. **Create a new Keypair**
   - **Setting up**
     - Open Terminal.
     - Create a new TypeScript project.
     - Initialize the project and add necessary dependencies.
     - Create configuration files and scripts for key generation, airdrop, transfer, and enrollment.
   - **Generating a Keypair**
     - Generate a new Solana keypair.
     - Save the keypair in a JSON file.

2. **Import/Export to Phantom**
   - **Conversion Functions**
     - Convert between wallet formats using base58 encoding and byte arrays.
     - Create a simple CLI tool for format conversion.

3. **Claim Token Airdrop**
   - **Import and Setup**
     - Import Keypair, Connection, and LAMPORTS_PER_SOL.
     - Recreate the Keypair object using its private key.
     - Establish a connection to the Solana devnet.
     - Claim 2 devnet SOL tokens and log the transaction.

4. **Transfer Tokens to WBA Address**
   - **Setup Transfer**
     - Import necessary modules and the dev wallet.
     - Define the WBA public key.
     - Create a devnet connection.
   - **Execute Transfer**
     - Create a transaction to transfer 0.1 SOL.
     - Sign, broadcast, and confirm the transaction.

5. **Empty devnet wallet into WBA wallet**
   - **Calculate Fees and Transfer Remaining Balance**
     - Get the balance of the dev wallet.
     - Calculate the transaction fee.
     - Transfer all remaining lamports minus the fee to the WBA wallet.
     - Sign, broadcast, and confirm the transaction.

6. **Submit your completion of the WBA pre-requisites program**
   - **Understanding PDA and IDL**
     - Learn about Program Derived Addresses (PDA) and Interface Definition Language (IDL).
   - **Consuming an IDL in TypeScript**
     - Create a type and object for the WBA prerequisite program.
     - Install necessary dependencies including Anchor.
     - Create a keypair and connection for the enrollment process.
     - Convert the GitHub account name to a utf8 buffer.
     - Create an Anchor provider using the connection and wallet.
     - Submit the GitHub account name to complete the prerequisites.

These steps guide you through setting up a development environment, managing Solana wallets, performing transactions, and submitting your completion for the WBA Enrollment dApp prerequisites.
