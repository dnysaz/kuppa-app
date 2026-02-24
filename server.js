const { execSync } = require('child_process');
const readline = require('readline');

/**
 * Kuppa.Js Entry Point
 * Authentically built by Ketut Dana
 * Optimized for Bun & Node.js Runtime
 */
try {
    // Attempt to load the optimized core server
    const { startServer } = require('./core/app/Server');
    startServer();

} catch (error) {
    // Handle missing core engine specifically
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('./core/app/Server')) {
        console.error('\x1b[31m%s\x1b[0m', '----------------------------------------------------------');
        console.error('\x1b[31m%s\x1b[0m', ' [Kuppa Error]: Core engine not found!');
        console.error('\x1b[31m%s\x1b[0m', '----------------------------------------------------------');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Would you like to run "kuppa run:install" now? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                try {
                    console.log('Kuppa: Starting installation...');
                    
                    // Detect runtime to use the correct installer command
                    const runner = typeof Bun !== 'undefined' ? 'bun' : 'node';
                    execSync(`${runner} kuppa run:install`, { stdio: 'inherit' });
                    
                    console.log('\x1b[32m%s\x1b[0m', 'Kuppa: Core installed successfully.');
                    console.log('\x1b[33m%s\x1b[0m', `Please restart using: ${runner} server.js`);
                } catch (installError) {
                    console.error('Kuppa: Installation failed. Please run it manually.');
                }
            } else {
                console.log('Kuppa: Manual installation required to start the server.');
            }
            rl.close();
            process.exit(1);
        });
    } else {
        // Log other critical boot errors
        console.error('\x1b[31m[Boot Critical Error]:\x1b[0m', error.message);
        process.exit(1);
    }
}