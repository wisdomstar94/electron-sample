import { BrowserWindow } from "electron";
import isDev from 'electron-is-dev';
import appRootPath from 'app-root-path';
import { config } from 'dotenv';
import path from 'path';
config({
  path: path.join(appRootPath.toString(), '.env'),
});

export function windowLoadUrlOrFile(browserWindow: BrowserWindow, url: string) {
  if (isDev) {
    let applyUrl = process.env.DEV_FRONT_BASE_URL ?? '';
    applyUrl += url;
    browserWindow.loadURL(applyUrl);
    browserWindow.webContents.openDevTools();
  } else {
    browserWindow.loadFile(path.join(__dirname, '..', '..', 'react', 'index.html'), {
      hash: url,
    });
  }
}