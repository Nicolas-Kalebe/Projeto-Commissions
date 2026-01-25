(async () => {
    const open = (await import('open')).default;

    const url = process.argv[2];

    if (!url) {
        console.error('Usage: node scripts/open-url.js <url>');
        process.exit(1);
    }

    try {
        await open(url);
    } catch (error) {
        console.error(`Failed to open ${url}:`, error);
        process.exit(1);
    }
})();
