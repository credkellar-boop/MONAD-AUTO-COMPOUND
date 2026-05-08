let isCompounding = false;

cron.schedule(config.compoundingInterval, async () => {
    if (isCompounding) return console.log('Previous cycle still running...');
    
    isCompounding = true;
    console.log('Running scheduled auto-compound task...');
    try {
        const wallet = setupWallet('monad');
        await autoCompound(wallet, 'monad');
    } catch (err) {
        console.error('Cron job error:', err);
    } finally {
        isCompounding = false;
    }
});
