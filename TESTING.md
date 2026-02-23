# Local Development & Testing Plan

This document outlines the strategy for robust local development and testing of the Teleplaylist Bot.

## 1. Local Environment Setup

### Environment Variables
Ensure you have a `.dev.vars` file (based on `.dev.vars.example`) with your test bot token:
```text
TOKEN="your_test_bot_token"
```
*Note: It is recommended to use a separate bot token for development (create one via [@BotFather](https://t.me/BotFather)).*

### Local Database
Apply migrations to your local D1 instance:
```bash
pnpm db:migrate
```
To inspect the local database during development:
```bash
pnpm db:studio
```

## 2. Real-Time Testing with Telegram

Since the bot uses webhooks, you need to expose your local server to the internet so Telegram can reach it.

### Step 1: Start the Local Server
```bash
pnpm dev
```
By default, this runs on `http://localhost:8787`.

### Step 2: Create a Tunnel
Use a tool like `ngrok` or `cloudflared` to create a public URL. This project comes with a script for `cloudflared`:
```bash
pnpm run tunnel
```
By default, this maps `localhost:8787` to a public URL.

### Step 3: Set the Webhook
Copy your tunnel URL and run the helper script:
```bash
pnpm run set-webhook <YOUR_TUNNEL_URL>
```
*Note: This script automatically reads your bot token from `.dev.vars`.*

## 3. Automated Testing

### Unit Tests
Run the automated test suite to ensure core logic remains intact:
```bash
pnpm test
```
This runs `vitest` and checks for regressions in translations, keyboard generation, and state logic.

### CI/CD Roadmap
- **GitHub Actions**: Add a workflow to run `pnpm lint` and `pnpm test` on every PR.
- **D1 Integration**: Use `better-sqlite3` to mock D1 in integration tests.
- **Wrangler Vitest**: Use `@cloudflare/vitest-pool-workers` for more accurate environment testing.

## 4. Manual Verification Checklist

Before every release, manually verify the following flows:

- [ ] **/start**: Main menu loads, user is registered in DB.
- [ ] **Create Playlist**: Modal/input flow works, playlist appears in menu.
- [ ] **Add Audio**: Uploading MP3 adds it to the active playlist.
- [ ] **Single Message UI**: Navigation (Back/Menu) correctly edits the existing message.
- [ ] **Delete Playlist**: Confirmation prompt appears and deletes the playlist.
- [ ] **Language Change**: All UI strings update instantly.
- [ ] **Pagination**: If > 10 playlists, pagination buttons appear and work.
