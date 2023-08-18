import { IUseElectronApiManager } from "./use-electron-api-manager.interface";
import { useEffect, useMemo, useRef, useState } from "react";
import { ICommon } from '../../../interfaces/common.interface';
import { IChannel } from "../../../interfaces/channel.interface";

declare global {
  interface Window {
    electronApi?: ICommon.ElectronApi;
  }
}

export function useElectronApiManager<T extends (keyof IChannel.RendererChannelMap)[]>(props?: IUseElectronApiManager.Props<T>) {
  const {
    listeners,
  } = props ?? {};
  const [electronApi, setElectronApi] = useState<ICommon.ElectronApi>();
  const isEnableElectronApi = useMemo(() => {
    if (electronApi === undefined) return false;
    return true;
  }, [electronApi]);
  const pureListenerItems = useRef<Map<string, IUseElectronApiManager.PureListenerItem>>(new Map());
  const listenersRef = useRef<IUseElectronApiManager.Listeners<T>>();
  listenersRef.current = listeners;

  useEffect(() => {
    setElectronApi(window.electronApi);
  }, []);

  useEffect(() => {
    if (isEnableElectronApi !== true) return;
    if (electronApi === undefined) return;
    if (listeners === undefined) return;
    if (listeners.length === 0) return;
    const pureListenerItemsRef = pureListenerItems.current;

    listeners.forEach((listener) => {
      let pureListenerItem = pureListenerItemsRef.get(listener.channel);
      if (pureListenerItem === undefined) {
        pureListenerItemsRef.set(listener.channel, {
          channel: listener.channel,
          callback(event, payload) {
            const targetListener = listenersRef.current?.find(x => x.channel === listener.channel);
            if (targetListener !== undefined) {
              targetListener.callback(event, payload);
            }
          },
        });
        pureListenerItem = pureListenerItemsRef.get(listener.channel);
      }
      if (pureListenerItem === undefined) return;
      electronApi.unlisten(listener.channel, pureListenerItem.callback);
      electronApi.listen(listener.channel, pureListenerItem.callback);
    });

    return () => {
      listeners.forEach((listener) => {
        const pureListenerItem = pureListenerItemsRef.get(listener.channel);
        if (pureListenerItem === undefined) {
          return;
        }
        electronApi.unlisten(listener.channel, pureListenerItem.callback);
      });
    };
  }, [isEnableElectronApi, listeners, electronApi]);

  return {
    isEnableElectronApi,
    electronApi,
  };
}