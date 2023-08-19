import { BrowserWindow, dialog, app } from 'electron';
import { CancellationToken, UpdateInfo, autoUpdater } from 'electron-updater';
import path from 'path';
import { config } from 'dotenv';
import { windowLoadUrlOrFile } from '../utils/common';
import { mainManager } from '../utils/main-manager';
import isDev from 'electron-is-dev';

config({
  path: path.join(__dirname, '..', '..', '.env'),
});

if (isDev) {
  autoUpdater.forceDevUpdateConfig = true;
}

/**
 * ******************************************************************************
 * auto update
 * ******************************************************************************
 */
autoUpdater.setFeedURL({
  provider: 's3',
  bucket: process.env.S3_DEPLOY_BUCKET_NAME,
  region: process.env.S3_DEPLOY_BUCKET_REGION,
  acl: 'public-read',
});

let cancellationToken: CancellationToken | undefined;
let updateWindow: BrowserWindow | undefined;
let updateInfo: UpdateInfo | undefined;

function getUpdateWindow() {
  if (updateWindow === undefined) {
    updateWindow = new BrowserWindow({
      width: 720,
      height: 260,
      webPreferences: {
        preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      },
    });

    updateWindow.on('ready-to-show', () => {
      updateWindow?.show();
      mainManager.sendToRenderer(updateWindow?.webContents, 'latest_version', {
        currentVersion: app.getVersion(),
        latestVersion: updateInfo?.version,
      });
    });

    updateWindow.on('closed', () => {
      console.log('@@updateWindow closed!!!');
      updateWindow = undefined;
      cancellationToken?.cancel();
    });

    return updateWindow;
  } else {
    return updateWindow;
  }
}

autoUpdater.on('checking-for-update', () => {
  console.log(`[autoUpdater] : checking-for-update`);
});

autoUpdater.on('update-available', (info) => {
  // 업데이트 가능하면 자동으로 다운로드가 진행됨.
  console.log(`[autoUpdater] : update-available`);
  updateInfo = info;
});

autoUpdater.on('update-not-available', (info) => {
  console.log(`[autoUpdater] : update-available`);
});

autoUpdater.on('error', (err) => {
  console.error(`[autoUpdater] : error`, err);
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok'],
    title: '에러 발생',
    message: '업데이트 도중 에러가 발생하였습니다',
    detail: JSON.stringify(err),
  });
});

autoUpdater.once('download-progress', (progressObj) => {
  console.log(`[autoUpdater] : download-progress (once)`, JSON.stringify(progressObj));
  const targetWindow = getUpdateWindow();
  windowLoadUrlOrFile(targetWindow, '/update/downloading');
  targetWindow.show();
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`[autoUpdater] : download-progress`, JSON.stringify(progressObj));
  const targetWindow = getUpdateWindow();
  mainManager.sendToRenderer(targetWindow.webContents, 'download_progress', {
    progressObj,
  });
});

autoUpdater.on('update-downloaded', (event) => {
  console.log(`[autoUpdater] : update-downloaded`);
  const targetWindow = getUpdateWindow();
  windowLoadUrlOrFile(targetWindow, '/update/downloaded');
  targetWindow.show();
});

/**
 * ******************************************************************************
 * listen
 * ******************************************************************************
 */
mainManager.listen('download_update', (event, payload) => {
  const targetWindow = getUpdateWindow();
  windowLoadUrlOrFile(targetWindow, '/update/downloading');
  targetWindow.show();

  cancellationToken = new CancellationToken();
  autoUpdater.downloadUpdate(cancellationToken);
});

mainManager.listen('execute_update', (event, payload) => {
  autoUpdater.quitAndInstall();
});

/**
 * ******************************************************************************
 * export
 * ******************************************************************************
 */
export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}
