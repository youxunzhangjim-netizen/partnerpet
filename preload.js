const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petRoomAPI', {
  setMousePassThrough: (shouldPassThrough) => {
    ipcRenderer.send('pet-room:set-mouse-pass-through', Boolean(shouldPassThrough));
  },
  quit: () => {
    ipcRenderer.send('pet-room:quit');
  }
});
