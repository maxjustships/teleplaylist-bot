# Setup Guide for Cloudflare Workers & D1 Migration

This guide explains how to set up and deploy the Telegram Playlist Bot to Cloudflare Workers and D1.

## Prerequisites
1.  [Cloudflare Account](https://dash.cloudflare.com/sign-up)
2.  [Node.js](https://nodejs.org/) and `pnpm` installed.
3.  [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-setup/) (already in project dependencies).
4.  Telegram Bot Token from [@BotFather](https://t.me/BotFather).

## 1. Cloudflare D1 Database Setup
Create a new D1 database:
```bash
npx wrangler d1 create teleplaylist-bot-db
```
This command will output a `database_id`. Update your `wrangler.json` with this ID:
```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "teleplaylist-bot-db",
    "database_id": "your-new-database-id",
    "migrations_dir": "drizzle"
  }
]
```

## 2. Environment Variables
You need to set the following secrets in Cloudflare:
```bash
npx wrangler secret put TOKEN
```
Optionally, set `DONATION_LINK` and `DONATION_FREQUENCY` if you want to use them.

## 3. Database Migrations
Generate and apply migrations locally and to the remote D1 database:
```bash
pnpm db:generate
pnpm db:migrate         # Apply locally for 'wrangler dev'
pnpm db:migrate:remote  # Apply to Cloudflare
```

## 4. Deploying
Deploy the worker:
```bash
pnpm deploy
```

## 5. Setting the Webhook
Tell Telegram where to send updates:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://teleplaylist-bot.<YOUR_SUBDOMAIN>.workers.dev
```

# Manual Testing Flow
Follow these steps to verify the bot is working correctly:

1.  **/start:** Send `/start` to the bot. It should display the main menu with 0 playlists.
2.  **Add Playlist:** Click "🆕 New playlist", enter a name. The bot should confirm and return to the main menu with 1 playlist.
3.  **Language:** Click "🌐 Language 🌐" and select a language. The menu should update to that language.
4.  **Manage Playlist:** Click on the playlist name you just created. It should show the playlist menu.
5.  **Add Audio:** Upload or forward an MP3 file to the bot while in the playlist menu. The bot should send the audio back with a "🗑️ Delete audio" button.
6.  **Delete Audio:** Click the "🗑️ Delete audio" button. The message should be deleted.
7.  **Rename Playlist:** Click "🔄 Rename playlist", enter a new name.
8.  **Delete Playlist:** Click "❌ Delete playlist" and confirm.
9.  **Stale Playlist:** Wait 36 hours (or manually adjust `lastPlaylistActiveTimestamp` in D1) and verify the `scheduled` handler moves you back to the main menu.

## Database Verification
You can inspect the database state at any time:
```bash
npx wrangler d1 execute teleplaylist-bot-db --command "SELECT * FROM users;"
npx wrangler d1 execute teleplaylist-bot-db --command "SELECT * FROM playlists;"
```
