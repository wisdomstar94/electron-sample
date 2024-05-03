import { IChannelMainToRenderer } from "../../../interfaces/channel-main-to-renderer.interface";

export declare namespace IUseElectronListener {
  export type Listener<T extends (keyof IChannelMainToRenderer.ChannelMap)> = {
    channel: T;
    callback: (event: Electron.IpcRendererEvent, payload: IChannelMainToRenderer.ChannelMap[T]) => void;
  }

  export interface Props<T extends (keyof IChannelMainToRenderer.ChannelMap)> {
    listener?: Listener<T>;
  }
}