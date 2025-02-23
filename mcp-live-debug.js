import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

class NodemonManager {
  constructor() {
    this.nodemonProcess = null;
    this.isShuttingDown = false;
  }

  start() {
    // Get the current file path and directory
    const fileName = fileURLToPath(import.meta.url);
    const currentScriptDirName = dirname(fileName);

    this.nodemonProcess = spawn('npm', [
      'run',
      '--silent',
      'nodemon',
      '--',
      '--quiet',
      '--watch', 'src',
      '-e', 'ts',
      '--exec', 'node ./build/index.js'
    ], {
      shell: true,
      stdio: 'inherit',
      cwd: currentScriptDirName,
      env: {
        ...process.env,
        PORT: '3098'
      }
    });

    this.nodemonProcess.on('error', (err) => {
      if (!this.isShuttingDown) {
        console.error('Failed to start nodemon:', err);
      }
    });

    this.nodemonProcess.on('exit', (code, signal) => {
      if (!this.isShuttingDown) {
        console.log(`Nodemon process exited with code ${code} and signal ${signal}`);
      }
    });
  }

  stop() {
    this.isShuttingDown = true;

    return new Promise((resolve, reject) => {
      if (!this.nodemonProcess) {
        resolve();
        return;
      }

      try {
        // Kill the process
        this.nodemonProcess.kill('SIGINT');

        // Wait for the process to exit
        this.nodemonProcess.on('exit', () => {
          this.nodemonProcess = null;
          resolve();
        });

        // Set a timeout in case the process doesn't exit
        setTimeout(() => {
          if (this.nodemonProcess) {
            this.nodemonProcess.kill('SIGKILL');
            this.nodemonProcess = null;
            resolve();
          }
        }, 5000);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Create nodemon manager
const nodemonManager = new NodemonManager();

// Start the process
nodemonManager.start();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  await nodemonManager.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...');
  await nodemonManager.stop();
  process.exit(0);
});

// Catch and log any unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
