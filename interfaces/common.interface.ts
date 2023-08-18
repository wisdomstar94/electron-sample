import { IChannel } from "./channel.interface";

export const UpdateStatuses = [
  'checking-for-update',
  'update-available',
  'update-not-available',
  'error',
  'download-progress',
  'update-downloaded',
  '',
] as const;

export declare namespace ICommon {
  // ... 
  export type UpdateStatus = typeof UpdateStatuses[number];

  export interface ElectronApi {
    sendToMain: <T extends IChannel.MainChannel>(channel: T, payload: IChannel.MainChannelMap[T]) => void;
    listen: (channel: IChannel.RendererChannel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => void;
    unlisten: (channel: IChannel.RendererChannel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => void;
    unlistenAll: (channel: IChannel.RendererChannel) => void;
  }
}