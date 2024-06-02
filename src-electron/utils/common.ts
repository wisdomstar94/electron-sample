import '../../electron.dotenv';
import { BrowserWindow, WebPreferences, app } from "electron";
import path from 'path';
import { isDev } from "./is-dev";
import { ExecException, exec } from "node:child_process";
import os from 'os';

export function windowLoadUrlOrFile(browserWindow: BrowserWindow, url: string) {
  const frontIsWebHosting = parseInt(process.env.FRONT_IS_WEB_HOSTING ?? '1');

  if (frontIsWebHosting === 1) { // 웹호스팅인 경우
    let applyUrl = process.env.DEV_FRONT_BASE_URL ?? '';
    applyUrl += url;
    browserWindow.loadURL(applyUrl);
    if (isDev) {
      browserWindow.webContents.openDevTools();
    }
  } else { // 번들로써 내부에 포함인 경우
    if (app.isPackaged) {
      browserWindow.loadFile(path.join(__dirname, '..', '..', 'react', 'index.html'), {
        hash: url,
      });
    } else {
      let applyUrl = process.env.DEV_FRONT_BASE_URL ?? '';
      applyUrl += '#' + url;
      browserWindow.loadURL(applyUrl);
      browserWindow.webContents.openDevTools();
    }
  }
}

export function webPreferencesWithDefaultOptions(webPreferences: WebPreferences): WebPreferences {
  return {
    preload: path.join(__dirname, '..', 'preload', 'preload.js'),
    devTools: isDev,
    ...webPreferences,
  };
}

export async function commandExecute(command: string) {
  return await new Promise<{
    error: ExecException | null,
    stdout: string,
    stderr: string,
  }>(function(resolve) {
    const type = os.type().toLowerCase();
    let shell: string | undefined;
    switch(type) {
      case 'linux': shell = 'bash'; break;
      case 'darwin': shell = 'zsh'; break;
      // case 'windows_nt': shell = '???'; break;
    }

    exec(command, { shell }, (error, stdout, stderr) => {
      console.log("STDOUT:", stdout, ", STDERR:", stderr);
      resolve({
        stdout,
        stderr,
        error,
      });
    });
  })
}