# PartnerPets Website Setup Values

This is the from-scratch checklist for things you do outside the code editor.

## 1. GitHub Repository

Create or open your GitHub repository, then push this project.

Use these commands locally:

```bash
git add .
git commit -m "Prepare PartnerPets release"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

Replace:

```txt
<your-user> = your GitHub username
<your-repo> = your repository name, for example partnerpets
```

## 2. Deploy The Bridge Server On Render

Recommended: use the included `render.yaml`.

If creating the Render Web Service manually, use:

```txt
Service type: Web Service
Runtime: Node
Root Directory: server
Build Command: npm ci --omit=dev
Start Command: npm start
Health Check Path: /healthz
```

Environment variables:

```txt
NODE_VERSION=20
NODE_ENV=production
HOST=0.0.0.0
SERVER_NAME=transparent-pet-room-bridge
CLIENT_ORIGINS=*
MAX_MESSAGE_LENGTH=600
ACCESS_TOKEN=
DEBUG_PAIR_CODES=false
```

For a private relay, set `ACCESS_TOKEN` to a long random value in Render only. Do not put the real value in GitHub.

Copy the Render HTTPS URL after deploy:

```txt
https://your-service-name.onrender.com
```

Test it in a browser:

```txt
https://your-service-name.onrender.com/healthz
```

Expected result:

```json
{"ok":true}
```

## 3. Optional Railway Deploy

Create a Railway service from the GitHub repo.

Use:

```txt
Service Root / Root Directory: server
Build Command: npm ci --omit=dev
Start Command: npm start
Health Check Path: /healthz
```

Environment variables:

```txt
NODE_ENV=production
HOST=0.0.0.0
SERVER_NAME=transparent-pet-room-bridge
CLIENT_ORIGINS=*
MAX_MESSAGE_LENGTH=600
ACCESS_TOKEN=
DEBUG_PAIR_CODES=false
```

Railway sets `PORT` automatically.

## 4. Optional Fly.io Deploy

From the project folder:

```bash
cd server
copy fly.toml.example fly.toml
fly launch
fly secrets set ACCESS_TOKEN="your-private-token-if-needed"
fly deploy
```

In `fly.toml`, keep:

```toml
[env]
  NODE_ENV = "production"
  HOST = "0.0.0.0"
  SERVER_NAME = "transparent-pet-room-bridge"
  CLIENT_ORIGINS = "*"
  MAX_MESSAGE_LENGTH = "600"
```

Do not write a real `ACCESS_TOKEN` into `fly.toml`; use `fly secrets set`.

## 5. Optional VPS With Docker

On the VPS:

```bash
git clone https://github.com/<your-user>/<your-repo>.git
cd <your-repo>
docker build -t partnerpets-bridge ./server
docker run -d \
  --name partnerpets-bridge \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e CLIENT_ORIGINS='*' \
  -e ACCESS_TOKEN='' \
  partnerpets-bridge
```

Put HTTPS in front of it with Caddy, Nginx, Traefik, or your cloud load balancer. The app should use the final HTTPS URL.

## 6. Put The Public Server URL Into The Desktop App

Edit `config.js` before packaging:

```js
window.PET_ROOM_CONFIG = Object.freeze({
  defaultServerUrl: 'https://your-service-name.onrender.com',
  defaultPairCode: '',
  defaultAccessToken: '',
  appMode: 'production'
});
```

Values:

```txt
defaultServerUrl = your deployed HTTPS bridge URL
defaultPairCode = empty string
defaultAccessToken = empty string for public builds
appMode = production
```

If you set `ACCESS_TOKEN` on the server, users should type that Access Key in the app settings. Do not commit the real key into `config.js` for public GitHub releases.

## 7. Build Installers

Install dependencies:

```bash
npm install
```

Build on each OS:

```bash
npm run dist:win
npm run dist:mac
npm run dist:linux
```

Output folder:

```txt
release/
```

## 8. GitHub Release

Push a version tag:

```bash
git tag v0.5.0
git push origin v0.5.0
```

GitHub Actions will build installers from `.github/workflows/release.yml` and upload files from:

```txt
release/**
```

## 9. What Users Need

Users do not need Node.js or code.

They only need:

```txt
Installed PartnerPets app
Server URL
Pair Code
Access Key only if your server requires one
```

For real remote use, give them:

```txt
Server URL: https://your-service-name.onrender.com
Pair Code: decide together in the app or generate one and share it privately
Access Key: blank unless your server uses ACCESS_TOKEN
```
