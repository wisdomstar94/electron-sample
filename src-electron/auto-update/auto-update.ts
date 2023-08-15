import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { config } from 'dotenv';
config({
  path: path.join(__dirname, '..', '..', '.env'),
});

autoUpdater.setFeedURL({
  provider: 's3',
  bucket: process.env.S3_DEPLOY_BUCKET_NAME,
  region: process.env.S3_DEPLOY_BUCKET_REGION,
  acl: 'public-read',
});

autoUpdater.on('checking-for-update', () => {
  console.info('업데이트 확인 중...');
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok'],
    title: '업데이트 확인 중',
    message: '업데이트 확인 중',
  });
});
autoUpdater.on('update-available', (info) => {
  console.info('업데이트가 가능합니다.');
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Ok'],
    title: '업데이트가 가능',
    message: '업데이트가 가능합니다',
  });
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
  let log_message = "다운로드 속도: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - 현재 ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.info(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  console.info('업데이트가 완료되었습니다.');
});

export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}