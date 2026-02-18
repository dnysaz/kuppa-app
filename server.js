const { execSync } = require('child_process');
const readline = require('readline');

/**
 * Kuppa.Js Entry Point
 * Authentically built by Ketut Dana
 */
try {
    const { startServer } = require('./core/app/Server');
    startServer();

} catch (error) {
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
                    // Menjalankan kuppa.js langsung dari sini
                    execSync('node kuppa run:install', { stdio: 'inherit' });
                    console.log('\x1b[32m%s\x1b[0m', 'Kuppa: Core installed. Please restart the server.');
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
        console.error(error);
        process.exit(1);
    }
}