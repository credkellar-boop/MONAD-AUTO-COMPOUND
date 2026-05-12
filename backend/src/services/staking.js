const { ethers } = require('ethers');
const config = require('../../config.json');
// Make sure to create this ABI file!
const STAKING_ABI = require('../abis/Staking.json'); 

// Move these to .env for security and flexibility
const DEV_WALLET = process.env.DEV_WALLET_ADDRESS;
const FEE_PERCENTAGE = BigInt(process.env.FEE_PERCENTAGE || 3);

const autoCompound = async (wallet, networkName = 'monad') => {
    try {
        const networkConfig = config.networks[networkName];
        const stakingContract = new ethers.Contract(
            networkConfig.stakingContract,
            STAKING_ABI,
            wallet
        );

        console.log('Checking pending rewards...');
        const pending = await stakingContract.pendingRewards(wallet.address);

        if (pending > 0n) {
            // 1. Claim Rewards
            const claimTx = await stakingContract.claimRewards();
            await claimTx.wait();
            console.log(`Claimed ${ethers.formatEther(pending)} tokens.`);

            // 2. Calculate and Send Fee
            const feeAmount = (pending * FEE_PERCENTAGE) / 100n;
            const remainder = pending - feeAmount;

            if (feeAmount > 0n && DEV_WALLET) {
                const feeTx = await wallet.sendTransaction({
                    to: DEV_WALLET,
                    value: feeAmount
                });
                await feeTx.wait();
                console.log(`Fee sent to dev wallet: ${ethers.formatEther(feeAmount)}`);
            }

            // 3. Re-stake the remainder
            const stakeTx = await stakingContract.stake(remainder);
            await stakeTx.wait();
            console.log('Auto-compounding successful.');
        } else {
            console.log('No rewards to compound.');
        }
    } catch (error) {
        console.error('Compounding failed:', error.message);
    }
};

module.exports = { autoCompound };
