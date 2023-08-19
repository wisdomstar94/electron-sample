import './electron.dotenv';
import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import { checkForUpdates } from './src-electron/auto-update/auto-update';
import './src-electron/listeners/listeners';
import log from 'electron-log';
import isDev from 'electron-is-dev';
import { windowLoadUrlOrFile } from './src-electron/utils/common';
import { mainManager } from './src-electron/utils/main-manager';

const electronLogPath = process.env.ELECTRON_LOG_PATH;
if (isDev && typeof electronLogPath === 'string') {
  console.log(`[Dev] ############### This is Dev Mode! ###############`);
  log.initialize({ preload: true, spyRendererConsole: true });
  log.transports.file.resolvePathFn = (variables: log.PathVariables, message?: log.LogMessage | undefined) => {
    return electronLogPath;
  };
  console.log = log.log;
} else {
  // console.log = log.log;
  // on Linux: ~/.config/{app name}/logs/main.log
  // on macOS: ~/Library/Logs/{app name}/main.log
  // on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log
}

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'src-electron', 'preload', 'preload.js'),
    },
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
