import { IChannelRendererToMain } from './channel-renderer-to-main.interface';
import { IChannelMainToRenderer } from './channel-main-to-renderer.interface';

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
    sendToMain: <T extends IChannelRendererToMain.Channel>(channel: T, payload: IChannelRendererToMain.ChannelMap[T]) => void;
    listen: (channel: IChannelMainToRenderer.Channel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => void;
    unlisten: (channel: IChannelMainToRenderer.Channel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => void;
    unlistenAll: (channel: IChannelMainToRenderer.Channel) => void;
  }
}