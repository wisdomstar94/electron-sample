import { contextBridge, ipcRenderer } from 'electron';
import { ICommon } from '../../interfaces/common.interface';

const electronApi: ICommon.ElectronApi = {
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  listen: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  unlisten: (channel, func) => {
    ipcRenderer.off(channel, func);
  },
  unlistenAll: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
};

contextBridge.exposeInMainWorld('electronApi', electronApi);
