// backend/src/services/staking.js
const { ethers } = require('ethers');
const config = require('../../config.json');

// Your Revenue Wallet
const DEV_WALLET = "0xYourWalletAddressHere"; 
const FEE_PERCENTAGE = 3; // Example: 3% performance fee

const STAKING_ABI = [
    "function claimRewards() external",
    "function stake(uint256 amount) external",
    "function pendingRewards(address user) external view returns (uint256)"
];

// Added for the fee transfer logic
const ERC20_ABI = [
    "function transfer(address to, uint256 amount) public returns (bool)"
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
            // 1. Claim all rewards
            console.log(`Claiming ${ethers.formatEther(pending)} tokens...`);
            const claimTx = await stakingContract.claimRewards();
            await claimTx.wait();
            
            // 2. Calculate the Fee
            const feeAmount = (pending * BigInt(FEE_PERCENTAGE)) / 100n;
            const amountToRestake = pending - feeAmount;

            // 3. Send Fee to your Dev Wallet
            console.log(`Sending ${FEE_PERCENTAGE}% fee to dev wallet...`);
            const tokenContract = new ethers.Contract(
                networkConfig.tokenAddress, 
                ERC20_ABI, 
                wallet
            );
            const feeTx = await tokenContract.transfer(DEV_WALLET, feeAmount);
            await feeTx.wait();

            // 4. Stake the remaining balance
            console.log(`Staking ${ethers.formatEther(amountToRestake)} tokens...`);
            const stakeTx = await stakingContract.stake(amountToRestake);
            await stakeTx.wait();
            
            console.log('Successfully compounded with fee collected!');
            return { 
                success: true, 
                userStaked: ethers.formatEther(amountToRestake),
                feeCollected: ethers.formatEther(feeAmount)
            };
        } else {
            return { success: false, reason: 'No pending rewards' };
        }
    } catch (error) {
        console.error('Error during compounding:', error);
        throw error;
    }
};

module.exports = { autoCompound };
