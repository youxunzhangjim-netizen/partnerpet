(function () {
  'use strict';

  // Copy these values into config.js before packaging a public build.
  // Public server URLs are okay to commit. Private Access Keys are not.
  window.PET_ROOM_CONFIG = Object.freeze({
    defaultServerUrl: 'https://your-partnerpets-bridge.onrender.com',
    defaultPairCode: '',
    defaultAccessToken: '',
    appMode: 'production'
  });
})();
