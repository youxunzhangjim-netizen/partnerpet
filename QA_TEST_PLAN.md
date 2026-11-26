# PartnerPets End-to-End QA Test Plan

Use this plan before each public release. Run P0 tests every release. Run P1 tests before public sharing. Run P2 tests when changing packaging, visuals, or platform support.

| # | Test name | Steps | Expected result | Likely failure signs | Priority |
|---|---|---|---|---|---|
| 1 | First launch without saved settings | Clear app localStorage/user data. Launch app. | Traditional Chinese UI appears. Setup panel is visible. Pair Code is generated locally. Server URL helper explains missing URL. | Blank window, English default, no setup panel, Pair Code is `default` for every install. | P0 |
| 2 | First launch with config.js public URL | Set `config.js` `defaultServerUrl` to deployed HTTPS URL, blank pair/access values. Clear localStorage. Launch app. | Server URL field is pre-filled from config. Pair Code is generated locally. Saved settings still override after edit. | Renderer ignores config, hardcoded localhost appears, saved settings overwritten. | P0 |
| 3 | Localhost single-computer testing | Run `npm run server`. Open app with `http://localhost:3000`. Open second app copy or second profile with same Pair Code. | Both connect on same computer. Helper says localhost is only for same-computer testing. | App claims remote-ready, sockets fail, pair never forms. | P0 |
| 4 | Same Wi-Fi LAN testing | Start server on one laptop. On second laptop use `http://<LAN-IP>:3000`. Same Pair Code. | Helper says usually same Wi-Fi only. Both pair if firewall allows port 3000. | Firewall blocks, app says paired but movement/message does not sync. | P1 |
| 5 | Different Wi-Fi remote testing | Deploy bridge to Render/Fly/Railway/VPS. Use HTTPS URL on two devices on different networks. | Helper says public HTTPS works across networks. Pairing, chat, poke, and movement work. | Works only on one network, WebSocket errors, wrong URL copied. | P0 |
| 6 | Two users same Pair Code | Both users enter same Server URL, same Pair Code, same Access Key if required. | State becomes paired/green. Each sees partner messages/actions. | Both remain waiting, third-room behavior, duplicate socket confusion. | P0 |
| 7 | Two users different Pair Codes | Two users connect to same server with different Pair Codes. | Each stays waiting for partner. No cross-room message or movement leaks. | User A receives user B messages or movement. | P0 |
| 8 | Wrong Access Key | Server has `ACCESS_TOKEN`. Client enters wrong Access Key. | App shows unauthorized Access Key state. Reconnect retries stop until settings change. | Infinite retry spam, unclear error, server accepts wrong token. | P0 |
| 9 | Server offline | Use valid public URL, stop server. Launch app. | Red/offline or reconnecting state. No crash. Local messages still show locally. | Renderer crash, repeated duplicate sockets, UI freezes. | P0 |
| 10 | Server wakes after sleeping | Use a host that sleeps. Let it sleep. Open app and wait for wake/reconnect. | App reconnects automatically and returns to waiting/paired. | Requires app restart, stale disconnected state. | P1 |
| 11 | Laptop changes Wi-Fi | Pair two apps, then switch one laptop to another Wi-Fi/hotspot. | App enters reconnecting, then reconnects when network is available. | Duplicate socket sessions, old room stuck, no reconnect. | P1 |
| 12 | Partner disconnects | Pair two users. Quit one app or disable network. | Remaining user sees partner disconnected/waiting state. | Still shows paired, messages vanish silently. | P0 |
| 13 | Partner reconnects | After test 12, reopen partner app with same settings. | Pair reforms cleanly. Movement/message/action sync resumes. | Room full for returning partner, both stuck waiting. | P0 |
| 14 | App restarts | Save settings, quit app, reopen. | Server URL, Pair Code, Access Key, room position, appearance, and language persist. | Setup resets unexpectedly, settings lost. | P0 |
| 15 | Drag pet_me and sync pet_partner | Pair two apps. Drag My Pet in app A. | App A drag is responsive. App B partner pet moves to matching percent position. | Laggy drag, pet leaves room, no sync. | P0 |
| 16 | Send Chinese message bubble | Send `今天想你了`. | Message log and bubble display Traditional Chinese exactly as text. | Garbled text, missing bubble, HTML-like rendering. | P0 |
| 17 | Send English message bubble | Send `I am here.` | Message log and bubble display English text. | Message blocked, bubble misplaced. | P1 |
| 18 | Send long mixed Chinese/English message | Send more than 600 mixed chars. | Input/server limit clamps safely. No layout break or HTML injection. | App freezes, log overflows, unsafe markup renders. | P0 |
| 19 | Poke partner pet | Click partner pet while paired. | Local partner pet reacts briefly. Remote user's own pet enters Shocked state. | Double poke after drag, no remote action. | P1 |
| 20 | Shocked state and bilingual text | Set custom zh/en shocked text. Toggle language. Receive poke. | Poke bubble uses selected language custom text; defaults work when blank. | Wrong language text, text not persisted. | P1 |
| 21 | Low-power after 3 minutes | Leave app idle with no input/socket activity for 3+ minutes. | Power pill shows low/eco. Decorative animations pause. Socket remains connected. | CPU/GPU remains high, socket disconnects because of low power. | P1 |
| 22 | Wake from low-power mode | Move mouse, press key, focus app, or receive socket event. | App returns to active mode and animations resume. | Stays stuck in low-power, misses incoming event. | P1 |
| 23 | Click-through outside Room Box | Move cursor outside room and click desktop/app behind it. | Click passes through to underlying window. | Transparent fullscreen window blocks desktop. | P0 |
| 24 | Input field interaction inside Room Box | Open settings. Type in Server URL, Pair Code, Access Key, message input. | Focus stays stable. Cursor does not jump. Outside click-through does not steal typing. | Fields flicker, lose focus, typed chars vanish. | P0 |
| 25 | Windows installer | On Windows runner/machine run `npm run dist:win`, install NSIS output. | App installs and opens without running code. | Installer missing, SmartScreen expected if unsigned, app opens blank. | P0 |
| 26 | macOS DMG | On macOS runner/machine run `npm run dist:mac`, open DMG. | App launches after normal unsigned-app approval or proper signing/notarization. | DMG missing, app blocked because not notarized, transparent window broken. | P1 |
| 27 | Linux AppImage | On Linux runner/machine run `npm run dist:linux`, run AppImage. | App opens and can connect to bridge. | Missing executable bit, Wayland/X11 transparency issue, no socket connection. | P2 |

## Battery QA Notes

Open Task Manager, Activity Monitor, or `top` while the app is idle. After 3 minutes, CPU/GPU usage should drop and no continuous renderer loop should appear. Socket.IO should stay connected unless the network/server goes away.

During pet dragging, check responsiveness by moving quickly across the room. Movement should feel immediate locally. Partner-side movement may update on the next paint frame, which is intentional to avoid rendering bursts.
