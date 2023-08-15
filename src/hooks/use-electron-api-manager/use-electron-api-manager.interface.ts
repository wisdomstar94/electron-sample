import { IpcRendererEvent } from "electron";
import { ICommon } from "../../../interfaces/common.interface";

export declare namespace IUseElectronApiManager {
  export interface ListenerItem {
    eventName: ICommon.ValidListenChannel;
    callback: (event: IpcRendererEvent, payload: any) => void;
  }

  export interface PureListenerItem {
    eventName: ICommon.ValidListenChannel;
    callback: (event: IpcRendererEvent, payload: any) => void;
  }

  export interface Props {
    listenerItems: ListenerItem[];
  }
}