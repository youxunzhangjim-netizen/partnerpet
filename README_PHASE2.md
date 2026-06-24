# Phase 2: Lightweight Socket.IO Server & Connection

This version adds:

- A production-oriented Socket.IO bridge server in `server/server.js`
- Automatic pairing of two clients with the same pair code
- Forwarding for `pet_move`, `send_msg`, and `pet_action`
- Clean disconnect handling and partner re-queueing
- Electron renderer connection using `socket.io-client`
- Reconnection status UI with LED/border feedback
- Automatic day/night room appearance based on the local clock

## Local test

Terminal A:

```bash
cd transparent-pet-room/server
npm install
npm start
```

Terminal B:

```bash
cd transparent-pet-room
npm install
npm start
```

Open the app on a second computer or launch a second copy, then use the same server URL and pair code in the settings panel.

Default server URL:

```txt
http://localhost:3000
```

For two laptops, replace `localhost` with your cloud URL or your LAN IP, for example:

```txt
http://192.168.1.20:3000
```

## Cloud deployment notes

The server reads `PORT`, so platforms like Render and Fly.io can inject the listening port automatically.

Optional environment variables:

```txt
CLIENT_ORIGINS=*
MAX_MESSAGE_LENGTH=600
SERVER_NAME=transparent-pet-room-server
```

For stricter CORS, set `CLIENT_ORIGINS` to a comma-separated list. Electron `file://` clients may send no origin, so the server accepts missing origins by default.
