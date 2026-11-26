# PartnerPets Socket.IO Bridge Deployment

This folder contains the deployable Node.js + Socket.IO bridge server. It is accountless by default and keeps pairing state in memory.

## Environment

```txt
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
SERVER_NAME=transparent-pet-room-bridge
CLIENT_ORIGINS=*
MAX_MESSAGE_LENGTH=600
ACCESS_TOKEN=
SERVER_ACCESS_KEY=
APP_SECRET=
DEBUG_PAIR_CODES=false
```

Use `ACCESS_TOKEN` for new deployments. `SERVER_ACCESS_KEY` and `APP_SECRET` remain supported aliases. If an access token is set, users must enter the same value in the desktop app's Access Key field.

`CLIENT_ORIGINS=*` is practical for Electron clients. If you later host a web client, use a comma-separated allowlist.

## Health Check

```txt
GET /healthz
```

The response includes `ok`, server name, uptime, waiting-pool count, active session count, and whether an access key is required.

## Privacy-Safe Logs

Production logs do not print raw Pair Codes or Access Keys. Pair Codes are represented as short SHA-256 hashes. Set `DEBUG_PAIR_CODES=true` only during private debugging.

## Render

Use the root `render.yaml`, or create a Web Service manually:

```txt
Root directory: server
Build command: npm ci --omit=dev
Start command: npm start
Health check path: /healthz
```

Set environment variables:

```txt
NODE_ENV=production
HOST=0.0.0.0
SERVER_NAME=transparent-pet-room-bridge
CLIENT_ORIGINS=*
MAX_MESSAGE_LENGTH=600
ACCESS_TOKEN=<optional long random secret>
```

Copy the Render HTTPS URL into the desktop app as Server URL.

## Fly.io

Copy the template and edit the app name:

```bash
cd server
cp fly.toml.example fly.toml
fly launch
fly secrets set ACCESS_TOKEN="a-long-random-secret"
fly deploy
```

Fly uses the included `Dockerfile` and exposes internal port `3000`.

## Railway

Create a Railway service from the repository and set the service root to `server`. Railway can use `server/railway.json`.

Suggested variables:

```txt
NODE_ENV=production
HOST=0.0.0.0
CLIENT_ORIGINS=*
ACCESS_TOKEN=<optional long random secret>
```

Railway injects `PORT` automatically.

## Generic VPS With Docker

From the repository root:

```bash
docker build -t partnerpets-bridge ./server
docker run -d \
  --name partnerpets-bridge \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e CLIENT_ORIGINS='*' \
  -e ACCESS_TOKEN='a-long-random-secret' \
  partnerpets-bridge
```

Put HTTPS in front of the container with Caddy, Nginx, Traefik, or your cloud load balancer. The desktop app should use the public HTTPS URL.
