import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElectronListener } from "../../hooks/use-electron-listener/use-electron-listener.hook";
import { IUseElectronListener } from "../../hooks/use-electron-listener/use-electron-listener.interface";
import { IChannelMainToRenderer } from "../../../interfaces/channel-main-to-renderer.interface";

export function IndexPage() {
  const [info, setInfo] = useState<IChannelMainToRenderer.ChannelMap['info']>();
  const navigate = useNavigate();

  const currentVersion = useMemo(() => {
    const v = info?.currentVersion;
    if (typeof v !== 'string') return undefined;
    return `v${v}`;
  }, [info?.currentVersion]);

  const isDev = useMemo(() => {
    const isDev = info?.isDev;
    if (isDev === undefined) return undefined;
    return `${isDev}`;
  }, [info?.isDev]);

  const listener = useMemo<IUseElectronListener.Listener<'info'>>(() => {
    return {
      channel: 'info',
      callback(event, payload) {
        console.log('@@info.payload', payload);
        setInfo(payload);
      },
    };
  }, []);

  useElectronListener({ listener });

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

      <div className="w-full relative">
        <button 
          className="inline-flex px-2 py-0.5 text-xs text-slate-700 border border-slate-400 cursor-pointer hover:bg-slate-100 rounded-sm"
          onClick={() => {
            navigate('/command');
          }}>
          /command 로 이동
        </button>
      </div>
    </>
  );
}