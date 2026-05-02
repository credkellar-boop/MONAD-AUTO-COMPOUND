// backend/src/services/wallet.js
require('dotenv').config();
const { ethers } = require('ethers');
const { getProvider } = require('../utils/provider');

const setupWallet = (network = 'monad') => {
    const provider = getProvider(network);
    // Initialize wallet with private key and connect to provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return wallet;
};

const checkBalance = async (wallet) => {
    const balance = await wallet.provider.getBalance(wallet.address);
    return ethers.formatEther(balance);
};

module.exports = { setupWallet, checkBalance };
