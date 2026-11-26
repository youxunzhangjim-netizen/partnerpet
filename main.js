const { app, BrowserWindow, ipcMain, Menu, screen, shell } = require('electron');
const path = require('node:path');

let mainWindow = null;

function createWindow() {
  const { bounds } = screen.getPrimaryDisplay();

  mainWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fullscreen: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    title: 'Transparent Pet Room',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Keep the renderer web-like: no Node.js globals, and only the tiny preload API below.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  Menu.setApplicationMenu(null);

  // A higher level helps the invisible canvas stay above normal app windows.
  // If this feels too aggressive on your OS, change 'screen-saver' to 'floating'.
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  // Useful on macOS/Linux workspaces. The visibleOnFullScreen option is macOS-only.
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // Start in pass-through mode so the transparent fullscreen canvas does not block the desktop.
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  mainWindow.loadFile('index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('pet-room:set-mouse-pass-through', (event, shouldPassThrough) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;

  if (shouldPassThrough) {
    win.setIgnoreMouseEvents(true, { forward: true });
  } else {
    win.setIgnoreMouseEvents(false);
  }
});

ipcMain.on('pet-room:quit', () => {
  app.quit();
});

ipcMain.on('pet-room:minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  win.minimize();
});

ipcMain.handle('pet-room:report-issue', async (event) => {
  if (!mainWindow || event.sender !== mainWindow.webContents) {
    throw new Error('Untrusted issue report request');
  }
  // The renderer cannot choose a URL, protocol, recipient, or message content.
  const body = "Project / 專案: PartnerPets\n\nWhat happened? / 遇到什麼問題？\n\nSteps to reproduce / 重現步驟:\n1. \n2. \n\nExpected result / 預期結果:\n\nBrowser or device / 瀏覽器或裝置:\n"
    + '\nApp version / 版本: ' + app.getVersion();
  const url = 'mailto:youxunzhangjim@gmail.com?subject='
    + encodeURIComponent('[PartnerPets] Problem report / 問題回報')
    + '&body=' + encodeURIComponent(body);
  await shell.openExternal(url);
});
