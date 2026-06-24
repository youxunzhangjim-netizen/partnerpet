# Phase 4 — Pet State Machine & Laptop Optimization

This phase adds a small JavaScript state machine for both pets and a low-power mode for long laptop sessions.

## Pet states

The renderer defines three core states:

- `Idle`: default placeholder image.
- `Walk`: used while dragging `pet_me` and while `pet_partner` is moving from a received `pet_move` event.
- `Shocked`: used when a `poke` action targets `pet_me`.

Each state swaps the pet `<img>` source:

```js
const PET_STATES = Object.freeze({
  IDLE: 'Idle',
  WALK: 'Walk',
  SHOCKED: 'Shocked'
});
```

The placeholder assets live in `assets/` and can be replaced with GIF, WebP, PNG, or sprite-sheet files later:

```txt
pet-me-idle.svg
pet-me-walk.svg
pet-me-shocked.svg
pet-partner-idle.svg
pet-partner-walk.svg
pet-partner-shocked.svg
```

## Poke interaction

Click `pet_partner` to send:

```js
socket.emit('pet_action', { action: 'poke', target: 'pet_me' });
```

The server forwards the event to the paired client. On the receiver, the local `pet_me` immediately changes to `Shocked`, shows a bubble for 3 seconds, and then returns to `Idle`.

Default bubble text:

```txt
繁體中文: 別戳我！
English: Don't touch me!
```

The owner can customize both texts in the settings panel. When poked, the owner's app sends a `poke_reaction` back so the other laptop can show the owner's custom bubble above `pet_partner` too.

## Low-power mode

The renderer tracks local activity and incoming server events. If there is no local mouse/keyboard/focus activity and no meaningful incoming Socket.IO signal for more than 3 minutes, the app enters `data-power="low"` mode.

Low-power mode:

- pauses decorative CSS animation loops;
- reduces day/night theme checking from every 60 seconds to every 5 minutes;
- keeps Socket.IO connected so messages and pet actions still arrive;
- instantly restores normal mode on local activity or incoming socket events.

## Mouse click-through optimization

The renderer still uses the Electron bridge from Phase 1, but now only sends `setIgnoreMouseEvents` IPC messages when the pass-through state actually changes. Focused inputs force the room into interactive mode briefly, preventing click-through toggling from interrupting typing on Windows/macOS.
