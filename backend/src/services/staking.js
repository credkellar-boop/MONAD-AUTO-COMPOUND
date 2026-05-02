// backend/src/services/staking.js
const { ethers } = require('ethers');
const config = require('../../config.json');

// Minimal ABI for Staking Contract (Claim & Stake)
const STAKING_ABI = [
    "function claimRewards() external",
    "function stake(uint256 amount) external",
    "function pendingRewards(address user) external view returns (uint256)"
];

const autoCompound = async (wallet, network = 'monad') => {
    try {
        const networkConfig = config.networks[network];
        const stakingContract = new ethers.Contract(
            networkConfig.stakingContract,
            STAKING_ABI,
            wallet
        );

        console.log(`Checking pending rewards on ${network}...`);
        const pending = await stakingContract.pendingRewards(wallet.address);
        
        if (pending > 0n) {
            console.log(`Claiming ${ethers.formatEther(pending)} tokens...`);
            const claimTx = await stakingContract.claimRewards();
            await claimTx.wait();
            
            console.log(`Staking ${ethers.formatEther(pending)} tokens...`);
            const stakeTx = await stakingContract.stake(pending);
            await stakeTx.wait();
            
            console.log('Successfully compounded!');
            return { success: true, amount: ethers.formatEther(pending) };
        } else {
            console.log('No rewards to compound.');
            return { success: false, reason: 'No pending rewards' };
        }
    } catch (error) {
        console.error('Error during compounding:', error);
        throw error;
    }
};

module.exports = { autoCompound };
