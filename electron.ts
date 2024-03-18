import './electron.dotenv';
import { app, BrowserWindow } from 'electron';
import { checkForUpdates } from './src-electron/auto-update/auto-update';
import './src-electron/listeners/listeners';
import { convertConsoleLog, webPreferencesWithDefaultOptions, windowLoadUrlOrFile } from './src-electron/utils/common';
import { mainManager } from './src-electron/utils/main-manager';
import { isDev } from './src-electron/utils/is-dev';
convertConsoleLog();

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: webPreferencesWithDefaultOptions({
      // ...
    }),
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainManager.sendToRenderer(mainWindow?.webContents, 'info', {
      currentVersion: app.getVersion(),
      isDev,
    });
  });

  windowLoadUrlOrFile(mainWindow, '');

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });
}

app.on('ready', (): void => {
  createMainWindow();
  checkForUpdates();
});

app.on('window-all-closed', (): void => {
  app.quit();
});

app.on('activate', (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
