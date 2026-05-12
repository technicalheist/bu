---
name: browser-use-wrapped
description: Browser automation CLI (bu) — auto-returns page state after every command
allowed-tools: Bash(bu:*)
---

## Core Workflow

1. `bu install` — One-time setup (installs uv + browser-use in `~/.bu/`)
2. `bu open <url>` — Start browsing; state is returned automatically
3. Interact using `click`, `input`, `type`, `scroll`, etc. — state returned after each
4. `bu close` — End session

## Browser Modes

| Mode | Flag | Description |
|------|------|-------------|
| Headless | (default) | No visible browser window |
| Headed | `--headed` | Show browser window for debugging |
| Connect | `--cdp-url <url>` | Connect to existing Chrome instance |
| Profile | `--profile <name>` | Use a saved browser profile |

## Essential Commands

| Command | Description | Auto-State? |
|---------|-------------|-------------|
| `bu open <url>` | Navigate to URL | Yes |
| `bu click <n>` | Click element by index | Yes |
| `bu input <n> <text>` | Type into element | Yes |
| `bu type <text>` | Type into focused element | Yes |
| `bu select <n> <value>` | Select dropdown option | Yes |
| `bu keys <keys>` | Send key combination | Yes |
| `bu back` | Go back | Yes |
| `bu scroll <direction>` | Scroll page | Yes |
| `bu hover <n>` | Hover over element | Yes |
| `bu tab new` | Open new tab | Yes |
| `bu tab switch <n>` | Switch tab | Yes |
| `bu tab close` | Close tab | Yes |
| `bu upload <n> <file>` | Upload file | Yes |
| `bu state` | Get current page state | No (returns state only) |
| `bu screenshot` | Take screenshot | No |
| `bu get <property>` | Get page property | No |
| `bu close` | Close session | No |

## Global Options

- `--session <name>` — Named session for multi-tab workflows
- `--headed` — Show browser window
- `--profile <name>` — Use saved profile
- `--cdp-url <url>` — Connect to Chrome DevTools
- `--json` — Output as JSON (auto-state merges into `{result, state}`)

## Troubleshooting

- **Command not found**: Run `bu install` first
- **Browser not starting**: Try `--headed` to see errors
- **Session issues**: Use `bu sessions` to list, `bu close` to cleanup
- **Reinstall**: Delete `~/.bu/` and run `bu install` again
