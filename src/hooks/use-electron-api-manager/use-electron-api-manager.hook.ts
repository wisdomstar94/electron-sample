import { IUseElectronApiManager } from "./use-electron-api-manager.interface";
import { useEffect, useMemo, useRef, useState } from "react";
import { ICommon } from '../../../interfaces/common.interface';

declare global {
  interface Window {
    electronApi?: ICommon.ElectronApi;
  }
}

export function useElectronApiManager(props: IUseElectronApiManager.Props) {
  const {
    listenerItems,
  } = props;
  const [electronApi, setElectronApi] = useState<ICommon.ElectronApi>();
  const isEnableElectronApi = useMemo(() => {
    if (electronApi === undefined) return false;
    return true;
  }, [electronApi]);
  const pureListenerItems = useRef<Map<string, IUseElectronApiManager.PureListenerItem>>(new Map());
  const listenerItemsRef = useRef<IUseElectronApiManager.ListenerItem[]>([]);
  listenerItemsRef.current = listenerItems;

  useEffect(() => {
    setElectronApi(window.electronApi);
  }, []);

  useEffect(() => {
    if (isEnableElectronApi !== true) return;
    if (electronApi === undefined) return;
    if (listenerItems.length === 0) return;
    const pureListenerItemsRef = pureListenerItems.current;

    listenerItems.forEach((item) => {
      let pureListenerItem = pureListenerItemsRef.get(item.eventName);
      if (pureListenerItem === undefined) {
        pureListenerItemsRef.set(item.eventName, {
          eventName: item.eventName,
          callback(event, payload) {
            const targetListenerItem = listenerItemsRef.current.find(x => x.eventName === item.eventName);
            if (targetListenerItem !== undefined) {
              targetListenerItem.callback(event, payload);
            }
          },
        });
        pureListenerItem = pureListenerItemsRef.get(item.eventName);
      }
      if (pureListenerItem === undefined) return;
      electronApi.unlistenFromMain(item.eventName, pureListenerItem.callback);
      electronApi.listenFromMain(item.eventName, pureListenerItem.callback);
    });

    return () => {
      listenerItems.forEach((item) => {
        const pureListenerItem = pureListenerItemsRef.get(item.eventName);
        if (pureListenerItem === undefined) {
          return;
        }
        electronApi.unlistenFromMain(item.eventName, pureListenerItem.callback);
      });
    };
  }, [isEnableElectronApi, listenerItems, electronApi]);

  return {
    isEnableElectronApi,
    electronApi,
  };
}