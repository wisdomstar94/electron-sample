import { IpcMainEvent, WebContents, ipcMain } from "electron";
import { IChannel } from "../../interfaces/channel.interface";

export const mainManager = {
  sendToRenderer: <T extends IChannel.RendererChannel>(webContents: WebContents | undefined, channel: T, payload: IChannel.RendererChannelMap[T]) => {
    webContents?.send(channel, payload);
  },
  reply: <T extends IChannel.RendererChannel>(event: IpcMainEvent, channel: T, payload: IChannel.RendererChannelMap[T]) => {
    event.reply(channel, payload);
  },
  listen: <T extends IChannel.MainChannel>(channel: T, func: (event: IpcMainEvent, payload: IChannel.MainChannelMap[T]) => void) => {
    ipcMain.on(channel, func);
  },
  unlisten: <T extends IChannel.MainChannel>(channel: T, func: (event: IpcMainEvent, payload: IChannel.MainChannelMap[T]) => void) => {
    ipcMain.off(channel, func);
  },
};
