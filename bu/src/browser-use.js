const { execFile } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const os = require('os');
const { BROWSER_USE_BIN } = require('./utils');
const { detectInteractive, extractFlags, combineOutputs } = require('./state');

const execFileAsync = promisify(execFile);

const NON_INTERACTIVE_COMMANDS = new Set([
  'state', 'screenshot', 'eval', 'get', 'wait', 'cookies', 'close', 'sessions',
  'doctor', 'config', 'install', 'init', 'setup', 'profile', 'tunnel',
  'python', 'register', 'help'
]);

async function runCommand(args) {
  const command = args[0];

  if (NON_INTERACTIVE_COMMANDS.has(command)) {
    const result = await execFileAsync(BROWSER_USE_BIN, args);
    process.stdout.write(result.stdout);
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }
    return;
  }

  const isInteractive = detectInteractive(args);

  try {
    const result = await execFileAsync(BROWSER_USE_BIN, args);
    process.stdout.write(result.stdout);
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }

    if (isInteractive) {
      const stateArgs = extractFlags(args);
      stateArgs.push('state');
      const stateResult = await execFileAsync(BROWSER_USE_BIN, stateArgs);
      const combined = combineOutputs(result.stdout, stateResult.stdout, args);
      process.stdout.write(combined);
      if (stateResult.stderr) {
        process.stderr.write(stateResult.stderr);
      }
    }
  } catch (err) {
    if (err.stdout) {
      process.stdout.write(err.stdout);
    }
    if (err.stderr) {
      process.stderr.write(err.stderr);
    }
    process.exit(err.status || 1);
  }
}

module.exports = { runCommand };
