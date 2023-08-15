import { ipcMain } from 'electron';

// ipcMain에서의 이벤트 수신
ipcMain.on('test_event_1', (event, payload) => {
  console.log('@test_event_1');
  console.log('@test_event_1.data', { event, payload });
  event.reply('test_event_2', 'message');
});