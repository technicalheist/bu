const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { BU_HOME, BROWSER_USE_BIN, existsSync, ensureDir } = require('./utils');

async function install() {
  console.log('Setting up browser-use...');

  ensureDir(BU_HOME);

  let uvPath;
  try {
    uvPath = execSync('which uv', { encoding: 'utf-8' }).trim();
    console.log('uv found at:', uvPath);
  } catch {
    console.log('uv not found. Installing uv...');
    try {
      execSync('curl -fsSL https://astral.sh/uv/install.sh | sh', { stdio: 'inherit' });
      const uvBinDir = path.join(os.homedir(), '.local', 'bin');
      if (!process.env.PATH.includes(uvBinDir)) {
        process.env.PATH = `${uvBinDir}:${process.env.PATH}`;
      }
      console.log('uv installed successfully.');
    } catch (err) {
      throw new Error('Failed to install uv: ' + err.message);
    }
  }

  if (existsSync(BROWSER_USE_BIN)) {
    console.log('browser-use is already installed.');
    console.log('Run `bu open https://example.com` to get started.');
    return;
  }

  console.log('Initializing Python project and installing browser-use...');
  try {
    execSync('uv init --name bu-env', { cwd: BU_HOME, stdio: 'inherit' });
    execSync('uv add browser-use', { cwd: BU_HOME, stdio: 'inherit' });
  } catch (err) {
    throw new Error('Failed to install browser-use: ' + err.message);
  }

  if (!existsSync(BROWSER_USE_BIN)) {
    throw new Error('browser-use binary not found after installation.');
  }

  console.log('');
  console.log('Setup complete!');
  console.log('Run `bu open https://example.com` to get started.');
}

module.exports = { install };
