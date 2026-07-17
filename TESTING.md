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

### Step 1: Start the Local Server & Tunnel
This project uses a persistent named Cloudflare tunnel `teleplaylist-dev` which is routed to a hostname you configure in your local `cloudflared.yml`.

Run both the development server and the tunnel with a single command:
```bash
pnpm run dev:tunnel
```
*This command runs `wrangler dev` on port 8787 and `cloudflared` using the local config concurrently.*

### Step 2: Set the Webhook
Once the tunnel is running, ensure your bot's webhook points to your persistent URL:
```bash
pnpm run set-webhook https://<your-tunnel-hostname>
```
*Note: This script automatically reads your bot token from `.dev.vars`.*

### Manual Tunneling (Alternative)
If you need to run a temporary tunnel or a different named tunnel:
- **Temporary:** `pnpm run tunnel:temp`
- **Named:** `cloudflared tunnel run --url http://localhost:8787 <YOUR_TUNNEL_NAME>`


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
