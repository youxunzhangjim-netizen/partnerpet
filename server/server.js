'use strict';

const http = require('node:http');
const crypto = require('node:crypto');
const { Server } = require('socket.io');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 600);
const SERVER_NAME = process.env.SERVER_NAME || 'transparent-pet-room-server';
const DEBUG_PAIR_CODES = process.env.DEBUG_PAIR_CODES === 'true';
const RATE_LIMITS = Object.freeze({
  pet_move: { windowMs: 1000, maxCount: 40 },
  send_msg: { windowMs: 5000, maxCount: 12 },
  pet_action: { windowMs: 1000, maxCount: 15 }
});

// Comma-separated allowlist, for example:
// CLIENT_ORIGINS=https://your-app.example.com,http://localhost:5173,file://
// The default is permissive because Electron file:// clients often send no Origin header.
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGINS || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Optional shared key. Leave empty for accountless/open pairing.
// Set ACCESS_TOKEN or SERVER_ACCESS_KEY in production when only invited users should connect.
// APP_SECRET is accepted as a backward-compatible alias.
const SERVER_ACCESS_KEY = String(process.env.ACCESS_TOKEN || process.env.SERVER_ACCESS_KEY || process.env.APP_SECRET || '').trim();

const waitingByPairCode = new Map(); // pairCode -> socket.id[]
const sessions = new Map(); // roomId -> { roomId, pairCode, members: Set<string>, createdAt }

const httpServer = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/healthz') {
    const body = JSON.stringify({
      ok: true,
      name: SERVER_NAME,
      uptime: Math.round(process.uptime()),
      waitingPools: waitingByPairCode.size,
      sessions: sessions.size,
      accessKeyRequired: SERVER_ACCESS_KEY.length > 0
    });

    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    });
    res.end(body);
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ ok: false, error: 'not_found' }));
});

function isOriginAllowed(origin) {
  if (ALLOWED_ORIGINS.includes('*')) return true;

  // Native Electron file:// clients may send no Origin or a null/file origin.
  if (!origin) return true;
  if (origin === 'null' || origin === 'file://') return ALLOWED_ORIGINS.includes('file://');

  return ALLOWED_ORIGINS.includes(origin);
}

const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin not allowed: ${origin}`));
      }
    },
    credentials: false
  },
  maxHttpBufferSize: 1e5,
  pingInterval: 25000,
  pingTimeout: 20000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 120000,
    skipMiddlewares: true
  }
});

function nowIso() {
  return new Date().toISOString();
}

function log(event, data = {}) {
  const line = { at: nowIso(), event, ...data };
  console.log(JSON.stringify(line));
}

function pairCodeMeta(pairCode) {
  // Pair Codes are invitation-like private data, so production logs only get a short hash.
  const hash = crypto.createHash('sha256').update(String(pairCode)).digest('hex').slice(0, 12);
  return DEBUG_PAIR_CODES ? { pairCode, pairCodeHash: hash } : { pairCodeHash: hash };
}

function safeString(value, maxLength = 120) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '').trim().slice(0, maxLength);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function timingSafeStringEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function isAccessAuthorized(socket) {
  if (!SERVER_ACCESS_KEY) return true;
  const provided = safeString(socket.handshake.auth?.accessKey || socket.handshake.query?.accessKey || '', 256);
  // Timing-safe comparison avoids leaking partial token matches.
  return timingSafeStringEqual(provided, SERVER_ACCESS_KEY);
}

function normalizePairCode(raw) {
  const value = safeString(raw || 'default', 64)
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
  return value || 'default';
}

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(Math.max(number, min), max);
}

function removeFromWaiting(socketId, pairCode) {
  if (!pairCode) return;

  const queue = waitingByPairCode.get(pairCode);
  if (!queue) return;

  const nextQueue = queue.filter((id) => id !== socketId);
  if (nextQueue.length === 0) {
    waitingByPairCode.delete(pairCode);
  } else {
    waitingByPairCode.set(pairCode, nextQueue);
  }
}

function getCleanWaitingQueue(pairCode) {
  const queue = waitingByPairCode.get(pairCode) || [];
  const cleanQueue = queue.filter((id) => {
    const candidate = io.sockets.sockets.get(id);
    return candidate && candidate.connected && !candidate.data.roomId;
  });

  if (cleanQueue.length === 0) {
    waitingByPairCode.delete(pairCode);
  } else {
    waitingByPairCode.set(pairCode, cleanQueue);
  }

  return cleanQueue;
}

function createPair(socketA, socketB, pairCode) {
  const roomId = `pair:${crypto.randomUUID()}`;
  const createdAt = Date.now();

  socketA.join(roomId);
  socketB.join(roomId);

  socketA.data.roomId = roomId;
  socketB.data.roomId = roomId;
  socketA.data.paired = true;
  socketB.data.paired = true;

  sessions.set(roomId, {
    roomId,
    pairCode,
    members: new Set([socketA.id, socketB.id]),
    createdAt
  });

  socketA.emit('paired', {
    roomId,
    side: 'a',
    partnerId: socketB.id,
    createdAt
  });

  socketB.emit('paired', {
    roomId,
    side: 'b',
    partnerId: socketA.id,
    createdAt
  });

  log('paired', { roomId, ...pairCodeMeta(pairCode), members: [socketA.id, socketB.id] });
}

function hasActiveSessionForPairCode(pairCode) {
  for (const session of sessions.values()) {
    if (session.pairCode === pairCode && session.members.size >= 2) {
      return true;
    }
  }

  return false;
}

function enqueueOrPair(socket) {
  // Pairing lifecycle:
  // 1. The first clean socket for a pair code waits in a FIFO queue.
  // 2. The second clean socket is paired with the first into a unique two-member room.
  // 3. Extra sockets using the same pair code are told the room is full and stay queued.
  // 4. If one paired socket disconnects, the partner leaves that room and re-enters the queue.
  // Existing realtime events remain partner-only and are never broadcast to the waiting queue.
  const pairCode = socket.data.pairCode;

  if (hasActiveSessionForPairCode(pairCode)) {
    const queue = getCleanWaitingQueue(pairCode);
    if (!queue.includes(socket.id)) queue.push(socket.id);
    waitingByPairCode.set(pairCode, queue);
    socket.data.paired = false;
    socket.data.roomId = undefined;
    socket.emit('room_full', { queued: true, queuedAt: Date.now() });
    log('room_full_waiting', { socketId: socket.id, ...pairCodeMeta(pairCode) });
    return;
  }

  const queue = getCleanWaitingQueue(pairCode).filter((id) => id !== socket.id);
  const partnerId = queue.shift();

  if (partnerId) {
    waitingByPairCode.set(pairCode, queue);
    const partner = io.sockets.sockets.get(partnerId);

    if (partner && partner.connected && !partner.data.roomId) {
      createPair(partner, socket, pairCode);
      return;
    }
  }

  const nextQueue = getCleanWaitingQueue(pairCode);
  if (!nextQueue.includes(socket.id)) nextQueue.push(socket.id);
  waitingByPairCode.set(pairCode, nextQueue);

  socket.data.paired = false;
  socket.data.roomId = undefined;
  socket.emit('waiting_for_partner', { queuedAt: Date.now() });
  log('waiting_for_partner', { socketId: socket.id, ...pairCodeMeta(pairCode) });
}

function isRateLimited(socket, eventName, windowMs, maxCount) {
  const now = Date.now();
  socket.data.rateLimits ||= {};
  const bucket = socket.data.rateLimits[eventName] || { start: now, count: 0 };

  if (now - bucket.start > windowMs) {
    bucket.start = now;
    bucket.count = 0;
  }

  bucket.count += 1;
  socket.data.rateLimits[eventName] = bucket;
  if (bucket.count <= maxCount) return false;

  socket.emit('rate_limited', {
    event: eventName,
    retryAfterMs: Math.max(0, windowMs - (now - bucket.start))
  });

  log('rate_limited', { socketId: socket.id, event: eventName });
  return true;
}

function emitToPartner(socket, eventName, payload) {
  const roomId = socket.data.roomId;
  if (!roomId || !sessions.has(roomId)) {
    socket.emit('not_paired', { event: eventName, at: Date.now() });
    return false;
  }

  socket.to(roomId).emit(eventName, {
    ...payload,
    from: socket.id,
    at: Date.now()
  });

  return true;
}

function handlePetMove(socket, payload = {}) {
  const limit = RATE_LIMITS.pet_move;
  if (isRateLimited(socket, 'pet_move', limit.windowMs, limit.maxCount)) return;

  if (!isPlainObject(payload)) {
    socket.emit('payload_error', { event: 'pet_move', error: 'invalid_payload' });
    return;
  }

  const x = clampNumber(payload.x, 0, 100);
  const y = clampNumber(payload.y, 0, 100);

  if (x === null || y === null) {
    socket.emit('payload_error', { event: 'pet_move', error: 'invalid_coordinates' });
    return;
  }

  emitToPartner(socket, 'pet_move', {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3))
  });
}

function handleSendMessage(socket, payload = {}) {
  const limit = RATE_LIMITS.send_msg;
  if (isRateLimited(socket, 'send_msg', limit.windowMs, limit.maxCount)) return;

  if (!isPlainObject(payload)) {
    socket.emit('payload_error', { event: 'send_msg', error: 'invalid_payload' });
    return;
  }

  // User text is forwarded as text only. Never log message content.
  const text = safeString(payload.text, MAX_MESSAGE_LENGTH);
  if (!text) return;

  emitToPartner(socket, 'send_msg', {
    text,
    lang: safeString(payload.lang || '', 12)
  });
}

function sanitizeActionToken(value, maxLength = 40) {
  return safeString(value, maxLength).replace(/[^a-zA-Z0-9_:-]/g, '');
}

function sanitizeActionMeta(meta) {
  if (!isPlainObject(meta)) return undefined;

  const clean = {};

  if (typeof meta.text === 'string') {
    clean.text = safeString(meta.text, 160);
  }

  if (Number.isFinite(Number(meta.duration))) {
    clean.duration = Math.min(Math.max(Number(meta.duration), 500), 10000);
  }

  if (typeof meta.state === 'string') {
    clean.state = sanitizeActionToken(meta.state, 40);
  }

  return Object.keys(clean).length > 0 ? clean : undefined;
}

function handlePetAction(socket, payload = {}) {
  const limit = RATE_LIMITS.pet_action;
  if (isRateLimited(socket, 'pet_action', limit.windowMs, limit.maxCount)) return;

  if (!isPlainObject(payload)) {
    socket.emit('payload_error', { event: 'pet_action', error: 'invalid_payload' });
    return;
  }

  const action = sanitizeActionToken(payload.action, 40);
  if (!action) {
    socket.emit('payload_error', { event: 'pet_action', error: 'invalid_action' });
    return;
  }

  emitToPartner(socket, 'pet_action', {
    action,
    pet: sanitizeActionToken(payload.pet, 40),
    target: sanitizeActionToken(payload.target, 40),
    meta: sanitizeActionMeta(payload.meta)
  });
}

function cleanupSessionFor(socket, reason) {
  const pairCode = socket.data.pairCode;
  removeFromWaiting(socket.id, pairCode);

  const roomId = socket.data.roomId;
  if (!roomId) return;

  const session = sessions.get(roomId);
  sessions.delete(roomId);

  socket.to(roomId).emit('partner_disconnected', {
    reason: safeString(reason, 80) || 'disconnect',
    at: Date.now()
  });

  if (!session) return;

  for (const memberId of session.members) {
    if (memberId === socket.id) continue;

    const partner = io.sockets.sockets.get(memberId);
    if (partner && partner.connected) {
      partner.leave(roomId);
      partner.data.roomId = undefined;
      partner.data.paired = false;

      // Small grace period prevents a short network flap from instantly causing UI churn.
      setTimeout(() => {
        if (partner.connected && !partner.data.roomId) enqueueOrPair(partner);
      }, 1200).unref?.();
    }
  }

  log('session_cleaned', { roomId, ...pairCodeMeta(pairCode), reason });
}

io.on('connection', (socket) => {
  const pairCode = normalizePairCode(socket.handshake.auth?.pairCode || socket.handshake.query?.pairCode);

  if (!isAccessAuthorized(socket)) {
    log('unauthorized_client', {
      socketId: socket.id,
      origin: socket.handshake.headers.origin || null
    });
    socket.emit('auth_error', { code: 'auth_error', message: 'Invalid server access key.' });
    socket.disconnect(true);
    return;
  }

  socket.data.pairCode = pairCode;
  socket.data.connectedAt = Date.now();
  socket.data.paired = false;
  socket.data.roomId = undefined;

  socket.emit('server_hello', {
    socketId: socket.id,
    serverName: SERVER_NAME,
    pairCodeHash: pairCodeMeta(pairCode).pairCodeHash,
    protocolVersion: 2,
    time: Date.now()
  });

  log('client_connected', {
    socketId: socket.id,
    ...pairCodeMeta(pairCode),
    transport: socket.conn.transport.name,
    recovered: socket.recovered === true
  });

  enqueueOrPair(socket);

  socket.on('pet_move', (payload) => handlePetMove(socket, payload));
  socket.on('send_msg', (payload) => handleSendMessage(socket, payload));
  socket.on('pet_action', (payload) => handlePetAction(socket, payload));

  socket.on('disconnecting', (reason) => {
    cleanupSessionFor(socket, reason);
  });

  socket.on('disconnect', (reason) => {
    removeFromWaiting(socket.id, pairCode);
    log('client_disconnected', { socketId: socket.id, ...pairCodeMeta(pairCode), reason });
  });
});

httpServer.listen(PORT, HOST, () => {
  log('server_started', { host: HOST, port: PORT, env: NODE_ENV, allowedOrigins: ALLOWED_ORIGINS, accessKeyRequired: SERVER_ACCESS_KEY.length > 0 });
});

function shutdown(signal) {
  log('shutdown_started', { signal });

  io.emit('server_shutdown', { signal, at: Date.now() });

  io.close(() => {
    httpServer.close(() => {
      log('shutdown_complete', { signal });
      process.exit(0);
    });
  });

  setTimeout(() => {
    log('shutdown_forced', { signal });
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
