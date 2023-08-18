import { BrowserWindow, dialog, app } from 'electron';
import { CancellationToken, UpdateInfo, autoUpdater } from 'electron-updater';
import path from 'path';
import { config } from 'dotenv';
import { windowLoadUrlOrFile } from '../functions/common';
import { mainManager } from '../functions/main-manager';

config({
  path: path.join(__dirname, '..', '..', '.env'),
});

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
  console.info('업데이트 확인 중...');
});

autoUpdater.on('update-available', (info) => {
  updateInfo = info;
  const targetWindow = getUpdateWindow();
  windowLoadUrlOrFile(targetWindow, '/update/available');
  targetWindow.show();
  console.info('업데이트가 가능합니다.');
});

autoUpdater.on('update-not-available', (info) => {
  console.info('현재 최신버전입니다.');
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok'],
    title: '현재 최신버전입니다',
    message: '현재 최신버전입니다',
  });
});

autoUpdater.on('error', (err) => {
  console.info('에러가 발생하였습니다. 에러내용 : ' + err);
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok'],
    title: '에러 발생',
    message: '에러가 발생하였습니다',
    detail: JSON.stringify(err),
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  const targetWindow = getUpdateWindow();
  mainManager.sendToRenderer(targetWindow.webContents, 'download_progress', {
    progressObj,
  });
});

autoUpdater.on('update-downloaded', (event) => {
  console.info('업데이트에 필요한 데이터를 다운로드 받았습니다.');
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
