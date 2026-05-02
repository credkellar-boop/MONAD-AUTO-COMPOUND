// backend/src/index.js
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const config = require('../config.json');
const { setupWallet, checkBalance } = require('./services/wallet');
const { autoCompound } = require('./services/staking');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Set up the daily cron job for auto-compounding
cron.schedule(config.compoundingInterval, async () => {
    console.log('Running scheduled auto-compound task...');
    const wallet = setupWallet('monad');
    await autoCompound(wallet, 'monad');
});

// API Routes for the Frontend Dashboard
app.get('/api/status', async (req, res) => {
    try {
        const wallet = setupWallet('monad');
        const balance = await checkBalance(wallet);
        
        res.json({
            address: wallet.address,
            network: 'Monad',
            nativeBalance: balance,
            status: 'Active'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/trigger-compound', async (req, res) => {
    try {
        const wallet = setupWallet('monad');
        const result = await autoCompound(wallet, 'monad');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Auto-Compounder Backend running on port ${PORT}`);
});
