import { IpcRendererEvent } from "electron";
import { IChannel } from "../../../interfaces/channel.interface";

export declare namespace IUseElectronApiManager {
  export type Listeners<T extends (keyof IChannel.RendererChannelMap)[]> = [
    ...{ 
      [I in keyof T]: { 
        channel: T[I];
        callback: (event: Electron.IpcRendererEvent, payload: IChannel.RendererChannelMap[T[I]]) => void;
      }
    }
  ];

  export interface PureListenerItem {
    channel: IChannel.RendererChannel;
    callback: (event: IpcRendererEvent, payload: any) => void;
  }

  export interface Props<T extends (keyof IChannel.RendererChannelMap)[]> {
    listeners?: Listeners<T>;
  }
}