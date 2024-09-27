This repository contains all my work done during Q3 Turbine Solana Builders Cohort.

# NFT Ticketing Platform (NFTickets)

### Devnet Deployed Address: `DUe3UGUaWHrh1Aq9Vs6fbbdFFDA4uMKXsb2NWs7cd3Mh`

## Project Overview

The NFT Ticketing Platform is a decentralized solution aimed at revolutionizing the event ticketing industry by leveraging blockchain technology, specifically on the Solana network. The platform allows artists to engage with their audience directly by selling NFT-based tickets, which offer various customizations, including non-transferable tickets, royalty percentages, and reselling time frames. The platform also incorporates a reward system where users earn platform-specific tokens upon purchasing tickets.

### Key Features

1. **Artist Customization**: Artists can customize how their tickets are sold by setting parameters like:
   - Transferability options
   - Bidding for premium tickets
   - Resale restrictions (time frames, royalties, etc.)
   
2. **Admin Control**: Admins approve events and ensure compliance, as well as manage platform policies.

3. **User Experience**: 
   - Users can purchase, sell, and bid on NFT tickets securely.
   - NFT tickets serve as proof of entry, stored in digital wallets.

4. **Rewards System**: On every ticket purchase, users are rewarded with platform-specific tokens, enhancing engagement.

5. **Lazy Minting**: Instead of minting all tickets upfront, tickets are minted only when purchased, reducing storage and gas costs.

### Tech Stack

- **Smart Contracts**: Built using **Anchor** framework on **Solana**.
- **Programming Language**: Rust for on-chain logic.
- **Frontend**: Next.js (TypeScript) for user interaction with the blockchain.
- **Backend**: API integration via Next.js server.
- **Database**: PostgreSQL for event data management.

### Smart Contract Overview

- **Platform PDA**: Contains platform-specific details such as admin, reward mint authority, and platform name.
- **Event PDA**: Created when a new event is listed, storing event-specific data (capacity, pricing, custom settings).
- **Ticket PDA**: Lazy minted on user purchase, associated with seating and other ticket information.
  
### Setting Up the Project

1. **Initialize the Platform**: 
   - The platform is initialized with an admin account and sets up a reward token mint.
   - The platform itself acts as the mint authority for all token-related activities.

2. **Event Creation**:
   - Artists create an event with customizable settings such as bidding and seating.
   - Events are verified and approved by the admin.

3. **Lazy Minting**:
   - Tickets are minted only when a user purchases them, saving on transaction costs and storage.
   - Upon ticket minting, associated reward tokens are sent to the buyer’s wallet.

4. **Reward System**:
   - Users are rewarded platform tokens on each ticket purchase. 
   - The platform handles token minting and distribution through the event's PDA.

### How to Contribute

1. Clone the repo
   ```bash
   git clone <repo-url>
   cd nft-ticketing-platform

