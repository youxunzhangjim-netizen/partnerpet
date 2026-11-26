const { contextBridge, ipcRenderer } = require('electron');

// Minimal privileged bridge. Do not expose filesystem, shell, or arbitrary IPC.
contextBridge.exposeInMainWorld('petRoomAPI', {
  setMousePassThrough: (shouldPassThrough) => {
    ipcRenderer.send('pet-room:set-mouse-pass-through', Boolean(shouldPassThrough));
  },
  quit: () => {
    ipcRenderer.send('pet-room:quit');
  },
  reportIssue: () => ipcRenderer.invoke('pet-room:report-issue'),
  minimize: () => {
    ipcRenderer.send('pet-room:minimize');
  }
});
