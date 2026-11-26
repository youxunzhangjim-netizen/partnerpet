'use strict';

// Root Render entry point.
// The actual bridge implementation lives in server/server.js so the backend can
// still be deployed from the server/ folder when a host supports rootDir.
require('./server/server');
