import bs58 from 'bs58';
import promptSync from 'prompt-sync';

const prompt = promptSync();

// Function to convert base58 string to wallet byte array
function base58ToWallet() {
  const base58 = prompt('Enter your base58 private key: ');
  const wallet = bs58.decode(base58);
  console.log('Wallet byte array:', wallet);
}

// Function to convert wallet byte array to base58 string
function walletToBase58() {
  const walletStr = prompt('Enter your wallet byte array (comma separated): ');
  const wallet = walletStr.split(',').map(Number);
  const base58 = bs58.encode(Buffer.from(wallet));
  console.log('Base58 private key:', base58);
}

// Main function to select conversion direction
function main() {
  const choice = prompt('Convert to (1) base58 or (2) byte array? ');
  if (choice === '1') {
    walletToBase58();
  } else if (choice === '2') {
    base58ToWallet();
  } else {
    console.log('Invalid choice. Please enter 1 or 2.');
  }
}

main();
