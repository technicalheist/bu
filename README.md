# bu

Browser automation CLI — a short alias wrapper for [browser-use](https://github.com/browser-use/browser-use) with auto-state return after every command.

## Features

- **Short alias**: `bu` instead of typing `browser-use` every time
- **Auto-state**: After every interactive command (`open`, `click`, `input`, `type`, etc.), `bu` automatically returns the page state
- **JSON mode**: Output merged JSON with `--json` flag
- **Session management**: Named sessions for multi-tab workflows

## Installation

```bash
npm install -g bu
```

## Setup

```bash
bu install
```

Installs `uv` (if needed) and sets up `browser-use` in `~/.bu/`.

## Usage

```bash
bu open https://example.com    # Opens URL + returns state
bu click 5                     # Clicks element + returns state
bu input 3 "hello"             # Types text + returns state
bu state                       # Returns state only
bu screenshot                  # Takes screenshot only
bu close                       # Closes session
```

### Flags

```bash
bu --session foo open https://example.com
bu --headed open https://example.com
bu --json open https://example.com
```

### JSON Mode

With `--json`, output is a merged JSON object:

```json
{
  "result": "...",
  "state": "..."
}
```

## License

MIT
