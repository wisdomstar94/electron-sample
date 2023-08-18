import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { checkForUpdates } from './src-electron/auto-update/auto-update';
import './src-electron/listeners/listeners';
import appRootPath from 'app-root-path';
import log from 'electron-log';
import { windowLoadUrlOrFile } from './src-electron/functions/common';

if (isDev) {
  log.initialize({ preload: true, spyRendererConsole: true });
  log.transports.file.resolvePathFn = (variables: log.PathVariables, message?: log.LogMessage | undefined) => {
    return path.join(appRootPath.toString(), 'logs', 'electron.log');
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
