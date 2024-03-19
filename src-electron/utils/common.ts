import '../../electron.dotenv';
import { BrowserWindow, WebPreferences, app } from "electron";
import path from 'path';
import { isDev } from "./is-dev";
import log from 'electron-log';
import { ExecException, exec } from "node:child_process";

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

export function convertConsoleLog() {
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
}

export async function commandExecute(command: string) {
  return await new Promise<{
    error: ExecException | null,
    stdout: string,
    stderr: string,
  }>(function(resolve) {
    exec(command, (error, stdout, stderr) => {
      console.log("STDOUT:", stdout, ", STDERR:", stderr);
      resolve({
        stdout,
        stderr,
        error,
      });
    });
  })
}