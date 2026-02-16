# Docker Guide — TremorSync

## What Docker Does

Docker containerizes the **JavaScript toolchain** (Node.js, Expo CLI, Metro bundler) so every developer runs identical versions. It does NOT build native iOS/Android binaries.

## Prerequisites

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
2. [Expo Go](https://expo.dev/go) installed on your phone
3. A `.env` file (copy from `.env.example` and fill in your Firebase credentials)

## Quick Start

```bash
# 1. Copy env template and fill in your Firebase config
cp .env.example .env

# 2. Build the Docker image (first time only)
docker compose build

# 3. Start the dev server
docker compose up
```

Metro will print a QR code. Scan it with **Expo Go** on your phone.

## Common Commands

```bash
# Run TypeScript check
docker compose exec app npx tsc --noEmit

# Check dependency compatibility
docker compose exec app npx expo-doctor

# Install a new package
docker compose exec app npx expo install <package-name>

# Open a shell in the container
docker compose exec app sh
```

## Running WITHOUT Docker

If you prefer to run locally without Docker:

```bash
npm install
cp .env.example .env   # fill in Firebase config
npx expo start
```

## Connecting Your Phone

1. Phone and computer must be on the **same Wi-Fi network**
2. The Docker container uses `--tunnel` mode by default (via ngrok) which works even across networks
3. Scan the QR code from the terminal with Expo Go

## Troubleshooting

| Issue | Fix |
|---|---|
| QR code won't scan | Try `--tunnel` mode (default) or ensure same Wi-Fi |
| `node_modules` errors | `docker compose down -v && docker compose up --build` |
| Port conflicts | Change ports in `docker-compose.yml` |
| Slow on Windows | Enable WSL 2 backend in Docker Desktop settings |
