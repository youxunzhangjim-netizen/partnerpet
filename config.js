(function () {
  'use strict';

  // Production packaging defaults. Saved localStorage settings always win.
  // Keep private Access Keys out of GitHub; set them per-user instead.
  window.PET_ROOM_CONFIG = Object.freeze({
    defaultServerUrl: '',
    defaultPairCode: '',
    defaultAccessToken: '',
    appMode: 'development'
  });
})();
