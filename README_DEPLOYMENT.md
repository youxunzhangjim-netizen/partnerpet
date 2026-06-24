# Deployment, install, and cross-network usage

This phase keeps the app accountless by default. Two users only need:

1. the installed Electron app,
2. the same public Socket.IO server URL,
3. the same pair code,
4. the same optional server access key when the server uses `APP_SECRET` or `SERVER_ACCESS_KEY`.

No GitHub Pages, Vercel frontend, Firebase, or Firestore is required for the current realtime desktop pet app.

## Recommended production shape

```txt
Two installed desktop apps  --->  Public Socket.IO bridge server
Windows/macOS/Linux             Render / Fly.io / Railway / Cloud Run / VPS
```

The Electron app runs on each laptop. The Socket.IO server must be reachable from the public internet when the two devices are on different Wi-Fi networks, mobile hotspots, campuses, offices, or countries.

## Accountless mode

Use this for a private prototype or a small invite-only app.

Server environment:

```txt
NODE_ENV=production
CLIENT_ORIGINS=*
APP_SECRET=<leave empty, or set a long secret>
```

`SERVER_ACCESS_KEY` is also accepted as an alias for `APP_SECRET`.

In each installed app:

```txt
Server URL: https://your-bridge-server.example.com
Pair code: any shared phrase, for example neko-2026
Server access key: blank if the server has no APP_SECRET / SERVER_ACCESS_KEY; otherwise paste the same key
```

The pair code is not a user account. It is a temporary private room / invitation code.

## Safer accountless mode

For a public server, set an access key:

```txt
APP_SECRET=a-long-random-secret-at-least-32-characters
```

Then both users enter that same value in the app settings field called Server access key / 伺服器通行金鑰.

The server rejects clients with the wrong key before pairing.

## With-account mode, optional future feature

Do not add Firebase just for Phase 5. Add Firebase only if you need persistent user accounts, a friend list, saved avatars, paid entitlement, message history, or cross-device settings.

If Firebase is added later, use Firebase Authentication for identity and Firestore for profile/friend metadata. Keep realtime pet movement on Socket.IO because it is lower-latency and ephemeral.

An example rules file is included at:

```txt
firebase/firestore.rules.example
```

It is intentionally not active in the current app.

## Deploy server to Render

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Use `render.yaml` from the repo root, or configure manually:

```txt
Root directory: server
Build command: npm ci --omit=dev
Start command: npm start
Health check path: /healthz
```

4. Add environment variables:

```txt
NODE_ENV=production
SERVER_NAME=transparent-pet-room-bridge
CLIENT_ORIGINS=*
APP_SECRET=<optional long secret>
MAX_MESSAGE_LENGTH=600
```

5. Copy the public HTTPS URL into the app settings as Server URL.

## Deploy server to Railway

1. Create a Railway project from the GitHub repo.
2. Set the service root to `server`.
3. Railway can use `server/railway.json`.
4. Add the same environment variables as above.
5. Copy the public HTTPS URL into the app settings.

## Deploy server to Fly.io

1. Install and log in to `flyctl`.
2. Copy `server/fly.toml.example` to `server/fly.toml` and change the app name.
3. From the `server` folder, run:

```bash
fly launch
fly secrets set APP_SECRET="a-long-random-secret"
fly deploy
```

4. Copy the public HTTPS URL into the app settings.

## Build installable desktop apps

Install dependencies in the project root:

```bash
npm install
```

Build for your current OS:

```bash
npm run dist
```

Build scripts:

```bash
npm run dist:win
npm run dist:mac
npm run dist:linux
```

Installer outputs go to:

```txt
release/
```

Practical note: build Windows installers on Windows, macOS DMG on macOS, and Linux packages on Linux for the most reliable results.

Unsigned builds are fine for local testing, but macOS and Windows users may see security warnings. For public distribution, buy/use code signing certificates and notarize macOS builds.

## GitHub repo and releases

A GitHub repo is recommended because it gives you:

- a central backup of the code,
- easy deployment to Render/Railway/Fly,
- GitHub Actions builds,
- GitHub Releases for downloadable installers.

This project includes:

```txt
.github/workflows/build-electron.yml
```

Run it manually from GitHub Actions, or create a tag such as:

```bash
git tag v0.5.0
git push origin v0.5.0
```

The workflow uploads installer artifacts for Windows, macOS, and Linux. For tagged builds, it also attaches files from `release/` to a GitHub Release.

## Do you need github.io?

No, not for the app itself and not for the Socket.IO server.

Use GitHub Pages only as a simple landing page with screenshots, install links, privacy notes, and a support email.

## Do you need Vercel?

Not for the current recommended setup. Use a WebSocket-friendly Node host such as Render, Fly.io, Railway, Cloud Run, or a VPS for the Socket.IO server.

Vercel can serve WebSockets with Fluid Compute, but it follows function duration limits and requires external storage for persistent rooms/presence. That is more complex than this lightweight in-memory two-client bridge.

## Do you need Firebase / Firestore?

No for accountless realtime pets.

Yes only if you add persistent accounts, friend lists, saved cloud settings, or history. If you add it, never use open rules like `allow read, write: if true;` in production.

## User instructions

For each user:

1. Install the app.
2. Open it.
3. Click the gear icon.
4. Enter the same public Server URL.
5. Enter the same Pair code.
6. Enter Server access key only if the server owner gave you one.
7. Click Apply and reconnect.
8. Wait until both users see connected / paired.

## Troubleshooting

If both users are on different networks and cannot connect:

- Confirm the Server URL begins with `https://` for the deployed cloud server.
- Open `https://your-server-url/healthz` in a normal browser. It should show JSON with `ok: true`.
- Confirm both users use the same Pair code.
- If `accessKeyRequired` is true in `/healthz`, both users must enter the correct Server access key.
- Keep the server running as a paid/always-on instance for long background sessions. Free plans may sleep or disconnect long-lived sockets.
