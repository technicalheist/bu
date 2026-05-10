const INTERACTIVE_COMMANDS = new Set([
  'open', 'click', 'input', 'type', 'select', 'keys', 'back', 'scroll',
  'submit', 'hover', 'dblclick', 'rightclick',
  'tab', 'upload'
]);

const TAB_SUBCOMMANDS = new Set(['new', 'switch', 'close']);

const FLAG_PATTERN = /^--/;

function detectInteractive(args) {
  const command = args[0];

  if (!command || command.startsWith('--')) {
    const cmdIndex = args.findIndex(arg => !arg.startsWith('--'));
    if (cmdIndex === -1) return false;
    return detectInteractive(args.slice(cmdIndex));
  }

  if (INTERACTIVE_COMMANDS.has(command)) {
    if (command === 'tab') {
      const subcommand = args[1];
      return TAB_SUBCOMMANDS.has(subcommand);
    }
    return true;
  }

  return false;
}

function extractFlags(args) {
  const flags = [];
  const flagKeys = ['--session', '--headed', '--profile', '--cdp-url', '--json'];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    for (const key of flagKeys) {
      if (arg === key || arg.startsWith(key + '=')) {
        flags.push(arg);
        if (arg === key && i + 1 < args.length && !args[i + 1].startsWith('--')) {
          flags.push(args[i + 1]);
          i++;
        }
        break;
      }
    }
  }

  return flags;
}

function combineOutputs(commandOutput, stateOutput, args) {
  const isJson = args.includes('--json');

  if (isJson) {
    let result, state;
    try {
      result = JSON.parse(commandOutput);
    } catch {
      result = commandOutput;
    }
    try {
      state = JSON.parse(stateOutput);
    } catch {
      state = stateOutput;
    }
    return JSON.stringify({ result, state }, null, 2) + '\n';
  }

  return '\n--- Page State ---\n' + stateOutput;
}

module.exports = { detectInteractive, extractFlags, combineOutputs };
