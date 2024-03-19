import { IChannel } from "../../../interfaces/channel.interface";

export declare namespace IUseElectronListener {
  export type Listener<T extends (keyof IChannel.RendererChannelMap)> = {
    channel: T;
    callback: (event: Electron.IpcRendererEvent, payload: IChannel.RendererChannelMap[T]) => void;
  }

  export interface Props<T extends (keyof IChannel.RendererChannelMap)> {
    listener?: Listener<T>;
  }
}