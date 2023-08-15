export const UpdateStatuses = [
  'checking-for-update',
  'update-available',
  'update-not-available',
  'error',
  'download-progress',
  'update-downloaded',
  '',
] as const;

export const ValidListenChannels = [
  'test_event_2',
  ''
] as const;

export const ValidSendChannels = [
  'test_event_1',
  '',
] as const;

export declare namespace ICommon {
  // ... 
  export type UpdateStatus = typeof UpdateStatuses[number];
  export type ValidListenChannel = typeof ValidListenChannels[number];
  export type ValidSendChannel = typeof ValidSendChannels[number];

  export interface ElectronApi {
    sendToMain: (channel: ICommon.ValidSendChannel, data: any) => void;
    listenFromMain: (channel: ICommon.ValidListenChannel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => void;
    unlistenFromMain: (channel: ICommon.ValidListenChannel, func: (event: Electron.IpcRendererEvent, ...args: any) => void) => void
  }
}