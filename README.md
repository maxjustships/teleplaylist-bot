# Playlist bot

A simple bot that helps to organize your Telegram audios into convenient playlists.

## Running

Runs with docker.

1. Ensure Docker Engine is installed on your machine (with Docker Desktop or just a server)
2. Make sure you have mongodb container with mongo image running on your host in mongodb network

You can create one with:

```
docker run -d \
--name mongodb \
--mount type=volume,src=mongodb,dst=/data/db \
--mount type=volume,src=mongodb-config,dst=/data/configdb \
--restart unless-stopped \
-p 127.0.0.1:27017:27017 \
--network mongodb \
mongo:8.0-noble # or any other tag
```

3. Configure user and password for this app in your DB
4. Configure .env (see .env.sample)
5. Run commands

### Development

```
docker compose up --watch --build
```

### Publish for production

```
docker compose -f compose.yaml -f compose.production.yaml build
docker compose up -d
```

## Stack

- MongoDB
- TypeScript
- GrammY
- I18n

This bot was made with this starter: https://github.com/Borodutch/telegram-bot-starter
