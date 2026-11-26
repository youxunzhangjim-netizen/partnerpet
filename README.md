# PartnerPets / Transparent Pet Room

PartnerPets is a transparent fullscreen Electron desktop pet room for two people. Each user runs the installed app locally, enters the same Socket.IO bridge URL and pair code, and then sees a shared room with synced pet movement, chat bubbles, and lightweight pet interactions.

The current app is accountless by default. It does not require GitHub Pages, Vercel, Firebase, Firestore, or user accounts for realtime pairing.

## Features

- Transparent always-on-top Electron window with click-through outside the room.
- Movable and resizable pet room, saved in localStorage.
- Bilingual UI toggle for Traditional Chinese and English.
- Day/night room appearance based on the local clock.
- Two pet sprites: local pet and partner pet.
- Drag the local pet to sync its percentage position to the paired client.
- Send chat messages that appear in the log and in comic-style pet bubbles.
- Click the partner pet to send a poke action.
- Drag either pet inside the room; dragging My Pet still syncs to the paired client.
- Pet state machine with `Idle`, `Walk`, and `Shocked` sprite states.
- Custom local shocked-bubble text, saved in localStorage.
- Local appearance controls for room opacity, pet scale, day background image, and night background image.
- Low-power mode after 3 minutes without local activity or meaningful socket activity.
- Deployable Socket.IO bridge server with optional shared access key.

## Project Layout

```txt
.
|-- index.html                  # Transparent pet room UI and CSS
|-- renderer.js                 # UI state, pet movement, Socket.IO client, i18n
|-- main.js                     # Electron BrowserWindow and IPC shell
|-- preload.js                  # Safe Electron bridge exposed to the renderer
|-- config.js                   # Package-time public defaults for the desktop app
|-- config.production.example.js # Example production defaults, no secrets
|-- package.json                # Electron app scripts and installer build config
|-- render.yaml                 # Render blueprint for the bridge server
|-- assets/                     # Placeholder pet SVG sprites
|-- server/
|   |-- server.js               # Socket.IO bridge server
|   |-- package.json            # Server dependencies and scripts
|   |-- Dockerfile              # Container build for server-only deploys
|   |-- railway.json            # Railway deploy config
|   |-- fly.toml.example        # Fly.io deploy template
|   `-- .env.example            # Server environment example
|-- firebase/
|   `-- firestore.rules.example # Optional future account-mode rules
`-- .github/workflows/
    |-- build-electron.yml      # Manual/tagged Electron installer builds
    `-- release.yml             # Version-tag GitHub Release installer builds
```

## Requirements

- Node.js 20 or newer.
- npm.
- A desktop OS supported by Electron: Windows, macOS, or Linux.

## Local Development

Install app dependencies from the project root:

```bash
npm install
```

Install server dependencies:

```bash
cd server
npm install
```

Start the bridge server from the project root:

```bash
npm run server
```

In another terminal, start the Electron app from the project root:

```bash
npm start
```

For development with DevTools:

```bash
npm run dev
```

Default connection settings inside the app:

```txt
Server URL: http://localhost:3000
Pair code: default
Server access key: blank
```

To test pairing, open a second copy of the app or run it on another computer using the same server URL and pair code. On a LAN, replace `localhost` with the server machine's LAN IP, for example:

```txt
http://192.168.1.20:3000
```

## How Pairing Works

Two clients join the same private room when they connect to the same bridge server with the same pair code. The pair code is not an account; it is a temporary invitation-room label.

The bridge server keeps pairing state in memory. If the server restarts, clients reconnect and pair again.

Realtime events:

```txt
pet_move    -> { x, y }
send_msg    -> { text, lang }
pet_action  -> { action, pet, target, meta }
```

The server validates, clamps, rate-limits, and forwards these events only to the paired partner.

## Server Configuration

The bridge server reads these environment variables:

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
```

`ACCESS_TOKEN` is optional and recommended for new deployments. `SERVER_ACCESS_KEY` and `APP_SECRET` are accepted as aliases for backward compatibility. If any of them is set, both users must enter the same value in the app's Access Key field.

`CLIENT_ORIGINS=*` is permissive and works well for Electron file clients. For stricter CORS, set a comma-separated allowlist. Missing origins are accepted because native Electron `file://` clients may not send an Origin header.

Health check:

```txt
GET /healthz
```

The response includes `ok`, server name, uptime, waiting pool count, active session count, and whether an access key is required.

Full server deployment instructions are in `server/README_SERVER_DEPLOY.md`.

For exact website field names and values from a fresh GitHub repo to public release, use `WEBSITE_SETUP_VALUES.md`.

## Deploy The Bridge Server

For users on different networks, deploy the Socket.IO bridge to a public WebSocket-friendly Node host such as Render, Railway, Fly.io, Cloud Run, or a VPS.

Recommended production shape:

```txt
Two installed desktop apps  --->  Public Socket.IO bridge server
Windows/macOS/Linux             Render / Fly.io / Railway / Cloud Run / VPS
```

### Render

Use the included `render.yaml`, or configure Render manually for the `server/` folder:

```txt
Root directory: server
Build command: npm ci --omit=dev
Start command: npm start
Health check path: /healthz
```

Suggested environment variables:

```txt
NODE_ENV=production
SERVER_NAME=transparent-pet-room-bridge
HOST=0.0.0.0
CLIENT_ORIGINS=*
MAX_MESSAGE_LENGTH=600
ACCESS_TOKEN=<optional long secret>
```

### Railway

Create a Railway service from the repo, set the service root to `server`, and use `server/railway.json`. Add the same environment variables as above.

### Fly.io

Copy the template and edit the app name:

```bash
cd server
copy fly.toml.example fly.toml
```

Deploy:

```bash
fly launch
fly secrets set ACCESS_TOKEN="a-long-random-secret"
fly deploy
```

### VPS With Docker

Build and run only the server folder:

```bash
cd server
docker build -t partnerpets-bridge .
docker run -d --name partnerpets-bridge \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e CLIENT_ORIGINS='*' \
  -e ACCESS_TOKEN='optional-long-secret' \
  partnerpets-bridge
```

## User Setup

Each user should:

1. Install and open the desktop app.
2. Click the settings button.
3. Enter the same public Server URL.
4. Enter the same Pair code.
5. Enter the Server access key only if the server owner provided one.
6. Click Apply and reconnect.
7. Wait until both users show connected or paired.

## Production App Config

Before packaging a public build, you can pre-fill the default Socket.IO bridge URL without editing `renderer.js`.

Edit `config.js`:

```js
window.PET_ROOM_CONFIG = Object.freeze({
  defaultServerUrl: 'https://your-partnerpets-bridge.onrender.com',
  defaultPairCode: '',
  defaultAccessToken: '',
  appMode: 'production'
});
```

`defaultPairCode` should usually stay blank. On first launch, each install generates and saves its own pair code locally. `defaultAccessToken` should also stay blank for public builds; never commit real private Access Keys to GitHub.

Saved settings in the app always override `config.js`, so users can change Server URL, Pair Code, and Access Key later from the gear settings.

## Build Desktop Apps

From the project root:

```bash
npm install
npm run dist
```

Platform-specific scripts:

```bash
npm run dist:win
npm run dist:mac
npm run dist:linux
```

`electron-builder` is configured to write build output to:

```txt
release/
```

For the most reliable signed installers, build Windows artifacts on Windows, macOS artifacts on macOS, and Linux artifacts on Linux.

## GitHub Releases

The included workflows build installers on Windows, macOS, and Linux when run manually or when a `v*` tag is pushed. To create a release:

```bash
git status
git tag v0.5.0
git push origin v0.5.0
```

GitHub Actions builds the native installers and uploads files from `release/**` to the tag's GitHub Release.

Before a public release, configure code signing:

- Windows: use an Authenticode certificate so SmartScreen warnings are reduced.
- macOS: use an Apple Developer ID certificate and notarization so users can open the DMG normally.
- Linux AppImage: signing is optional, but checksums are still recommended.

Without signing, the app can still be built and installed, but Windows and macOS may show strong security warnings.

Before publishing, run the release checks in `QA_TEST_PLAN.md`.

## Privacy And Abuse Notes

- Pair Codes are not accounts or passwords. Treat them like temporary invite room names.
- The bridge server logs Pair Code hashes only, unless `DEBUG_PAIR_CODES=true`.
- Access Keys are compared server-side and should be shared privately.
- Chat text is forwarded only to the paired partner and is not logged by the server.
- The renderer displays remote text with `textContent`, not HTML.
- The server validates payload shape, clamps pet movement, limits message length, and rate-limits `pet_move`, `send_msg`, and `pet_action`.
- Electron keeps `contextIsolation: true`, `nodeIntegration: false`, and a minimal preload API.

## Replacing Pet Assets

The active state sprites are:

```txt
assets/pet-me-idle.svg
assets/pet-me-walk.svg
assets/pet-me-shocked.svg
assets/pet-partner-idle.svg
assets/pet-partner-walk.svg
assets/pet-partner-shocked.svg
```

You can replace them with SVG, PNG, WebP, GIF, or another browser-supported image format. If you change filenames, update `PET_STATE_IMAGES` in `renderer.js`.

Legacy placeholder files also exist:

```txt
assets/pet-me.svg
assets/pet-partner.svg
```

## Firebase / Account Mode

Firebase is not used by the current accountless realtime app.

Only add Firebase Authentication and Firestore if you later need persistent accounts, friend lists, saved cloud settings, payment entitlement, message history, or profile metadata. Keep realtime pet movement on Socket.IO because the movement and interaction events are ephemeral and latency-sensitive.

An example future rules file is included at:

```txt
firebase/firestore.rules.example
```

## Troubleshooting

- If users are on different networks, the Server URL should usually begin with `https://`.
- Open `https://your-server/healthz` in a browser and confirm it returns JSON with `ok: true`.
- Confirm both users entered the same Server URL and Pair code.
- If `/healthz` reports `accessKeyRequired: true`, both users must enter the correct Server access key.
- Free hosting plans may sleep, restart, or disconnect long-lived socket sessions.
- If the app reports that `socket.io-client` is missing, run `npm install` in the project root.
- If the transparent window blocks the desktop unexpectedly, check the Electron click-through bridge in `main.js` and `preload.js`.
