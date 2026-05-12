require('dotenv').config();
const { ethers } = require('ethers');

// Initialize providers for Monad and other chains
const getProvider = (network = 'monad') => {
    if (network === 'monad') {
        return new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
    } else if (network === 'ethereum') {
        return new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
    }
    
    throw new Error(`Unsupported network: ${network}`);
};

module.exports = { getProvider };
