import { useMemo, useState } from "react";
import { useElectronApiManager } from "../../hooks/use-electron-api-manager/use-electron-api-manager.hook";
import { IChannel } from "../../../interfaces/channel.interface";

export function IndexPage() {
  const [info, setInfo] = useState<IChannel.InfoChannelPayload>();

  const currentVersion = useMemo(() => {
    const currentVersion = info?.currentVersion;
    if (typeof currentVersion !== 'string') return undefined;
    return `v${currentVersion}`;
  }, [info?.currentVersion]);

  const isDev = useMemo(() => {
    const isDev = info?.isDev;
    if (isDev === undefined) return undefined;
    return `${isDev}`;
  }, [info?.isDev]);

  useElectronApiManager({
    listeners: [
      {
        channel: 'info',
        callback(event, payload) {
          console.log('@info.payload');
          console.log(payload);
          setInfo(payload);
        },
      },
    ],
  });

  return (
    <>
      <div className="w-full relative mb-2">
        index page! 
      </div>
      
      <div className="w-full relative mb-2">
        version: { currentVersion }
      </div>

      <div className="w-full relative">
        isDev: { isDev }
      </div>
    </>
  );
}