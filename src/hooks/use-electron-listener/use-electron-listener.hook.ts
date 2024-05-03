
import { useEffect, useRef, useState } from "react";
import { ICommon } from '../../../interfaces/common.interface';

import { IUseElectronListener } from "./use-electron-listener.interface";
import { IChannelMainToRenderer } from "../../../interfaces/channel-main-to-renderer.interface";

declare global {
  interface Window {
    electronApi?: ICommon.ElectronApi;
  }
}

export function useElectronListener<T extends (keyof IChannelMainToRenderer.ChannelMap)>(props?: IUseElectronListener.Props<T>) {
  const {
    listener,
  } = props ?? {};
  const [electronApi, setElectronApi] = useState<ICommon.ElectronApi>();
  const prevListener = useRef<IUseElectronListener.Listener<T>>();

  useEffect(() => {
    setElectronApi(window.electronApi);
  }, []);

  useEffect(() => {
    if (electronApi === undefined) return;
    if (listener === undefined) return;

    const prevListenerRef = prevListener.current;
    
    if (prevListenerRef?.callback !== undefined) {
      electronApi.unlisten(listener.channel, prevListenerRef?.callback);
    }

    electronApi.listen(listener.channel, listener.callback);

    prevListener.current = {
      channel: listener.channel,
      callback: listener.callback,
    };
    
    return () => {
      ;
      if (prevListenerRef?.callback !== undefined) {
        electronApi.unlisten(listener.channel, prevListenerRef?.callback);
      }
      electronApi.unlisten(listener.channel, listener.callback);
    };
  }, [listener, electronApi]);

  return {
    electronApi,
  };
}