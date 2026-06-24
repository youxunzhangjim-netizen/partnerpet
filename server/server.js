'use strict';

const http = require('node:http');
const crypto = require('node:crypto');
const { Server } = require('socket.io');

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 600);
const SERVER_NAME = process.env.SERVER_NAME || 'transparent-pet-room-server';

// Comma-separated allowlist, for example:
// CLIENT_ORIGINS=https://your-app.example.com,http://localhost:5173,file://
// The default is permissive because Electron file:// clients often send no Origin header.
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGINS || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Optional shared key. Leave empty for accountless/open pairing.
// Set SERVER_ACCESS_KEY in production when you want only invited users to connect.
// APP_SECRET is accepted as a backward-compatible alias.
const SERVER_ACCESS_KEY = String(process.env.SERVER_ACCESS_KEY || process.env.APP_SECRET || '').trim();

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

io.use((socket, next) => {
  if (!SERVER_ACCESS_KEY) {
    next();
    return;
  }

  const provided = safeString(socket.handshake.auth?.accessKey || socket.handshake.query?.accessKey || '', 256);
  if (timingSafeStringEqual(provided, SERVER_ACCESS_KEY)) {
    next();
    return;
  }

  log('unauthorized_client', {
    socketId: socket.id,
    origin: socket.handshake.headers.origin || null
  });
  next(new Error('unauthorized'));
});

function nowIso() {
  return new Date().toISOString();
}

function log(event, data = {}) {
  const line = { at: nowIso(), event, ...data };
  console.log(JSON.stringify(line));
}

function safeString(value, maxLength = 120) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function timingSafeStringEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function normalizePairCode(raw) {
  const value = safeString(raw || 'default', 64);
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

  log('paired', { roomId, pairCode, members: [socketA.id, socketB.id] });
}

function enqueueOrPair(socket) {
  const pairCode = socket.data.pairCode;
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
  socket.emit('waiting_for_partner', { pairCode, queuedAt: Date.now() });
  log('waiting_for_partner', { socketId: socket.id, pairCode });
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
  return bucket.count > maxCount;
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
  if (isRateLimited(socket, 'pet_move', 1000, 40)) return;

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
  if (isRateLimited(socket, 'send_msg', 5000, 12)) return;

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
  if (typeof meta !== 'object' || meta === null) return undefined;

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
  if (isRateLimited(socket, 'pet_action', 1000, 15)) return;

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

  log('session_cleaned', { roomId, pairCode, reason });
}

io.on('connection', (socket) => {
  const pairCode = normalizePairCode(socket.handshake.auth?.pairCode || socket.handshake.query?.pairCode);

  socket.data.pairCode = pairCode;
  socket.data.connectedAt = Date.now();
  socket.data.paired = false;
  socket.data.roomId = undefined;

  socket.emit('server_hello', {
    socketId: socket.id,
    serverName: SERVER_NAME,
    pairCode,
    protocolVersion: 2,
    time: Date.now()
  });

  log('client_connected', {
    socketId: socket.id,
    pairCode,
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
    log('client_disconnected', { socketId: socket.id, pairCode, reason });
  });
});

httpServer.listen(PORT, () => {
  log('server_started', { port: PORT, env: NODE_ENV, allowedOrigins: ALLOWED_ORIGINS, accessKeyRequired: SERVER_ACCESS_KEY.length > 0 });
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
