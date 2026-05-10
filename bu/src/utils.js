const fs = require('fs');
const path = require('path');
const os = require('os');

const BU_HOME = path.join(os.homedir(), '.bu');
const BROWSER_USE_BIN = path.join(BU_HOME, '.venv', 'bin', 'browser-use');

function existsSync(filePath) {
  return fs.existsSync(filePath);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = { BU_HOME, BROWSER_USE_BIN, existsSync, ensureDir };
