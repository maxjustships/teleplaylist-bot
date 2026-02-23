# Teleplaylist Bot

A Telegram bot to organize your audio files into convenient playlists. Built with grammY and deployed on Cloudflare Workers using D1 for database storage.

## Features

- **Single Message UI**: Clean chat history using inline keyboards and message editing.
- **Playlist Management**: Create, rename, and delete playlists easily.
- **Audio Organization**: Upload or forward audios to playlists.
- **Multilingual Support**: Available in multiple languages.
- **Cloudflare Native**: Optimized for Cloudflare Workers and D1.

## Quick Start

### 1. Prerequisites
- [Cloudflare Account](https://dash.cloudflare.com)
- [Node.js](https://nodejs.org/) & `pnpm`
- Telegram Bot Token from [@BotFather](https://t.me/BotFather)

### 2. Setup
Follow the detailed [Setup Guide](SETUP.md) to configure your Cloudflare environment and database.

### 3. Local Development
For instructions on running the bot locally with a persistent tunnel, check the [Testing Guide](TESTING.md).

## Commands
- `/start`: Open the main menu.

## Tech Stack
- [grammY](https://grammy.dev/): Telegram Bot Framework.
- [Cloudflare Workers](https://workers.cloudflare.com/): Serverless execution.
- [Cloudflare D1](https://developers.cloudflare.com/d1/): SQL database.
- [Drizzle ORM](https://orm.drizzle.team/): Type-safe database access.
- [Fluent](https://projectfluent.org/): Localization system.

## License
MIT
