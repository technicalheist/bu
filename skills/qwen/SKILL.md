---
name: qwen-chat
description: Automate Qwen Chat (chat.qwen.ai) — login, chat, and generate images via browser
allowed-tools: Bash(bu:*), Bash(curl:*)
---

## Prerequisites

- `bu` CLI installed and working
- `.env` file with `USERNAME` and `PASSWORD` for Qwen login

## Core Workflow

### 1. Login

```bash
# Open Qwen Chat
bu open https://chat.qwen.ai/

# Click "Log in" button
bu click 21

# Wait for login form
sleep 2

# Enter email (click parent span of shadow input)
bu input 2128 "$USERNAME"

# Enter password
bu input 2139 "$PASSWORD"

# Click "Sign in" button
bu click 2145

# Wait for dashboard to load
sleep 5
```

### 2. Send a Chat Message

The textarea is inside a shadow DOM. Always use click + type for proper event triggering:

```bash
# Find the textarea index from bu state, then:
bu click <textarea_index>
sleep 1
bu type "your message here"
sleep 1
# Click send button (appears after typing, index from bu state)
bu click <send_button_index>
# Wait for response
sleep <wait_time>
```

### 3. Generate an Image

Ask Qwen to generate an image in the chat:

```bash
# Type image prompt
bu click <textarea_index>
sleep 1
bu type "generate an image of <description>"
sleep 1
bu click <send_button_index>

# Wait for generation (can take 1-2 minutes)
sleep 120

# Check state for "Generating image" status and img elements
bu state
```

### 4. Extract and Save Generated Images

```bash
# Find generated image URLs (skip logo/icons)
bu eval "const imgs = document.querySelectorAll('img'); const results = []; imgs.forEach((img, i) => { if (img.src && !img.src.includes('alicdn') && !img.src.includes('logo')) results.push(i + ': ' + img.src); }); results.join('\\n')"

# Download each image
curl -sL -o screenshots/image_name.png "<image_url>"
```

## Key Element Indices (may vary per session)

These are dynamic — always verify with `bu state` first:

| Element | Notes |
|---------|-------|
| Log in button | Usually around index 21 on landing page |
| Email input parent span | Around 2128 |
| Password input parent span | Around 2139 |
| Sign in button | Around 2145 |
| Chat textarea | Shadow DOM, check `bu state` for placeholder="How can I help you today?" |
| Send button | Inside `.chat-prompt-send-button` or `.send-button`, appears after typing |
| Voice input button | `id=voice-input-button` |

## Important Notes

- **Element indices change** after page re-renders (e.g., after sending a message). Always get fresh state.
- **Shadow DOM inputs**: Use `bu input <parent_span_index> <text>` for shadow DOM fields.
- **Textarea**: Use `bu click <index>` then `bu type <text>` to properly trigger input events. `bu input` on shadow textareas may not fire events.
- **Send button** is disabled until text is entered. It becomes `<button />` (no `disabled` attr) when ready.
- **Image generation** takes 1-2 minutes. Look for "Generating image" status then wait for completion.
- **Generated images** are `<img>` elements with `cdn.qwenlm.ai` URLs. Skip alicdn.com URLs (icons/logos).

## Example: Complete Image Generation Flow

```bash
# 1. Type image prompt
bu click <textarea_index>
sleep 1
bu type "generate an image of a serene mountain lake at sunset"
sleep 1

# 2. Send
bu click <send_button_index>

# 3. Wait for generation
sleep 120

# 4. Extract URLs
IMG_URLS=$(bu eval "const imgs = document.querySelectorAll('img'); const urls = []; imgs.forEach(img => { if (img.src && img.src.includes('cdn.qwenlm.ai')) urls.push(img.src); }); urls.join(' ')" | grep -o 'https://[^ ]*')

# 5. Download
i=1
for url in $IMG_URLS; do
  curl -sL -o "screenshots/qwen_image_$i.png" "$url"
  i=$((i+1))
done
```

## Troubleshooting

- **Login fails**: Check `.env` file has `USERNAME` and `PASSWORD`. Verify indices with `bu state`.
- **Message not sending**: Textarea value may not trigger events. Use `click` + `type` combo.
- **No images generated**: Model may not support image gen. Try a clearer prompt.
- **Element not found**: Session may have expired. Re-login.
- **Timeout**: Increase sleep duration for image generation (can take 2+ minutes).
