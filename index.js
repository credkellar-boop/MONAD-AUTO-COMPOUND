require('dotenv').config();
const express = require('express');
const { autoCompound } = require('./staking');
const config = require('./config.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'active', network: config.network });
});

// Start the Auto-Compounder Loop
setInterval(async () => {
    console.log(`[${new Date().toISOString()}] Initiating auto-compound cycle...`);
    await autoCompound();
}, config.autoCompoundIntervalMs);

app.listen(PORT, () => {
    console.log(`Monad Auto-Compounder running on port ${PORT}`);
});
