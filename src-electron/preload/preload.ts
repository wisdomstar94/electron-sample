import { contextBridge, ipcRenderer } from 'electron';
import { ICommon } from '../../interfaces/common.interface';
import { Constraint } from '../../constraint/constraint';

const electronApi: ICommon.ElectronApi = {
  sendToMain: (channel: ICommon.ValidSendChannel, data: any) => {
    if (!Constraint.ValidSendChannel.includes(channel)) {
      console.error(`[sendToMain] "${channel}" 은 유효하지 않은 채널입니다.`);
      return;
    }
    ipcRenderer.send(channel, data);
  },
  listenFromMain: (channel: ICommon.ValidListenChannel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => {
    if (!Constraint.ValidListenChannel.includes(channel)) {
      console.error(`[listenFromMain] "${channel}" 은 유효하지 않은 채널입니다.`);
      return;
    }
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  unlistenFromMain: (channel: ICommon.ValidListenChannel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => {
    if (!Constraint.ValidListenChannel.includes(channel)) {
      console.error(`[listenFromMain] "${channel}" 은 유효하지 않은 채널입니다.`);
      return;
    }
    ipcRenderer.off(channel, func);
  },
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
