require('dotenv').config();
const { ethers } = require('ethers');
const config = require('./config.json');

// Minimal ABI for the staking contract. 
// Ensure these match the actual function names on the Monad contract.
const STAKING_ABI = [
  "function claimRewards() public",
  "function stake(uint256 amount) public",
  "function pendingRewards(address user) public view returns (uint256)"
];

async function autoCompound() {
  try {
    // 1. Initialize Provider and Wallet
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY is missing from .env file");
    }
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 2. Connect to Staking Contract
    // Ensure you add 'stakingContractAddress' to your config.json
    const stakingContract = new ethers.Contract(
      config.stakingContractAddress, 
      STAKING_ABI, 
      wallet
    );

    console.log(`Checking rewards for: ${wallet.address}`);

    // 3. Check Pending Rewards
    const pending = await stakingContract.pendingRewards(wallet.address);
    
    if (pending === 0n) {
      console.log('No rewards available to compound.');
      return true;
    }

    console.log(`Found ${ethers.formatEther(pending)} rewards. Starting cycle...`);

    // 4. Claim Rewards
    const claimTx = await stakingContract.claimRewards();
    await claimTx.wait();
    console.log('Rewards claimed.');

    // 5. Stake Rewards
    // Some Monad pools might auto-stake on claim; if so, this step is optional.
    const stakeTx = await stakingContract.stake(pending);
    await stakeTx.wait();

    console.log('Successfully compounded rewards for Monad network.');
    return true;
  } catch (error) {
    console.error('Error during auto-compounding:', error);
    return false;
  }
}

module.exports = { autoCompound };
