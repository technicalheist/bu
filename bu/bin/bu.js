#!/usr/bin/env node

const { runCommand } = require('../src/browser-use');
const { install } = require('../src/install');
const { update } = require('../src/update');
const { showHelp } = require('../src/help');
const { BU_HOME, BROWSER_USE_BIN, existsSync } = require('../src/utils');

const pkg = require('../package.json');
const args = process.argv.slice(2);

if (args.length === 0) {
  showHelp();
  process.exit(0);
}

const command = args[0];

if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (command === '--help' || command === '-h' || command === 'help') {
  showHelp();
  process.exit(0);
}

if (command === 'install') {
  install().catch(err => {
    console.error('Installation failed:', err.message);
    process.exit(1);
  });
} else if (command === 'update') {
  update().catch(err => {
    console.error('Update failed:', err.message);
    process.exit(1);
  });
} else {
  if (!existsSync(BROWSER_USE_BIN)) {
    console.error('browser-use not installed. Run `bu install` first.');
    process.exit(1);
  }
  runCommand(args).catch(err => {
    console.error('Command failed:', err.message);
    process.exit(1);
  });
}
