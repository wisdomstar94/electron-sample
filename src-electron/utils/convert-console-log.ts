import { isDev } from "./is-dev";
import log from 'electron-log';

function convertConsoleLog() {
  console.log(`convertConsoleLog ::: called!`);

  const electronLogPath = process.env.ELECTRON_LOG_PATH;
  if (isDev && typeof electronLogPath === 'string' && electronLogPath.trim() !== '') {
    log.initialize({ preload: true, spyRendererConsole: true });
    log.transports.file.resolvePathFn = (variables: log.PathVariables, message?: log.LogMessage | undefined) => {
      return electronLogPath;
    };
    console.log(`convertConsoleLog ::: changed console.log to log.log!`);
    console.log = log.log;
  } else {
    console.log(`convertConsoleLog ::: not changed!`);
    // console.log = log.log;
    // on Linux: ~/.config/{app name}/logs/main.log
    // on macOS: ~/Library/Logs/{app name}/main.log
    // on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log
  }
}

convertConsoleLog();