# Teleplaylist Bot

A Telegram bot for organizing audio files into playlists — built with grammY, deployed on Cloudflare Workers with D1.

Send the bot audio files and it keeps them organized in named playlists. Everything runs through a single-message inline-keyboard UI — no command spam, clean chat history.

## Features

- **Single-message UI** — all interactions happen through inline keyboards on one message, so your chat stays clean
- **Playlist management** — create, rename, delete playlists
- **Audio organization** — upload or forward audio to the active playlist; delete tracks with one tap
- **Pagination** — handles large playlist collections
- **Multilingual** — English, Russian, German, French, Italian, Spanish
- **Cloudflare-native** — Workers + D1 + scheduled cleanup, no server to maintain
- **Optional donations** — configurable `DONATION_LINK` support

## Commands

- `/start` — open the main menu

Everything else is handled through inline keyboard buttons.

## Tech stack

- [grammY](https://grammy.dev/) — Telegram bot framework
- [Cloudflare Workers](https://workers.cloudflare.com/) — serverless execution
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQL database
- [Drizzle ORM](https://orm.drizzle.team/) — type-safe database access
- [Fluent](https://projectfluent.org/) — localization

## Setup

Follow the [Setup Guide](SETUP.md) to create the D1 database, configure secrets, and deploy.

For local development with a Cloudflare tunnel, see the [Testing Guide](TESTING.md).

## Development

```bash
pnpm install
pnpm dev          # wrangler dev (local Workers runtime)
pnpm test         # vitest
pnpm lint         # prettier + eslint
pnpm db:generate  # generate Drizzle migrations
pnpm db:migrate   # apply migrations locally
pnpm deploy       # wrangler deploy to Cloudflare
```

Node 22+ and pnpm 10+ recommended.

## License

[MIT](LICENSE)
