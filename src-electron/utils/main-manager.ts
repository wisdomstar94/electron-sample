import { IpcMainEvent, WebContents, ipcMain } from "electron";
import { IChannelMainToRenderer } from '../../interfaces/channel-main-to-renderer.interface';
import { IChannelRendererToMain } from '../../interfaces/channel-renderer-to-main.interface';

export const mainManager = {
  sendToRenderer: <T extends  IChannelMainToRenderer.Channel>(webContents: WebContents | undefined, channel: T, payload: IChannelMainToRenderer.ChannelMap[T]) => {
    webContents?.send(channel, payload);
  },
  reply: <T extends IChannelMainToRenderer.Channel>(event: IpcMainEvent, channel: T, payload: IChannelMainToRenderer.ChannelMap[T]) => {
    event.reply(channel, payload);
  },
  listen: <T extends IChannelRendererToMain.Channel>(channel: T, func: (event: IpcMainEvent, payload: IChannelRendererToMain.ChannelMap[T]) => void) => {
    ipcMain.on(channel, func);
  },
  unlisten: <T extends IChannelRendererToMain.Channel>(channel: T, func: (event: IpcMainEvent, payload: IChannelRendererToMain.ChannelMap[T]) => void) => {
    ipcMain.off(channel, func);
  },
};
