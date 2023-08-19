import { BrowserWindow, WebPreferences, app } from "electron";
import isDev from 'electron-is-dev';
import path from 'path';

export function windowLoadUrlOrFile(browserWindow: BrowserWindow, url: string) {
  if (isDev && !app.isPackaged) {
    let applyUrl = process.env.DEV_FRONT_BASE_URL ?? '';
    applyUrl += '#' + url;
    browserWindow.loadURL(applyUrl);
    browserWindow.webContents.openDevTools();
  } else {
    browserWindow.loadFile(path.join(__dirname, '..', '..', 'react', 'index.html'), {
      hash: url,
    });
  }
}

export function webPreferencesWithDefaultOptions(webPreferences: WebPreferences): WebPreferences {
  return {
    preload: path.join(__dirname, '..', 'preload', 'preload.js'),
    devTools: isDev,
    ...webPreferences,
  };
}