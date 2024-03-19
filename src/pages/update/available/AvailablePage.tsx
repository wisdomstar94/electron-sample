import { useMemo, useState } from "react";
import { IUseElectronListener } from "../../../hooks/use-electron-listener/use-electron-listener.interface";
import { useElectronListener } from "../../../hooks/use-electron-listener/use-electron-listener.hook";
import { useElectronApi } from "../../../hooks/use-electron-api/use-electron-api.hook";

export function AvailablePage() {
  const [currentVersion, setCurrentVersion] = useState<string>();
  const [latestVersion, setLatestVersion] = useState<string>();
  const electronApi = useElectronApi();

  const listener = useMemo<IUseElectronListener.Listener<'latest_version'>>(() => {
    return {
      channel: 'latest_version',
      callback(event, payload) {
        console.log('@latest_version.payload', payload);
        setCurrentVersion(payload.currentVersion);
        setLatestVersion(payload.latestVersion);
      },
    };
  }, []);
  useElectronListener({ listener });

  return (
    <div className="w-full h-full fixed top-0 left-0 flex flex-wrap gap-2 items-center justify-center bg-slate-50">
      <div className="w-full max-w-[320px] relative flex gap-2 flex-wrap">
        <div className="w-full">
          최신 버전이 아닙니다. 업데이트 파일을 다운로드 하시겠습니까?
        </div>
        <div className="w-full text-sm text-slate-700">
          현재 버전 : { currentVersion }
        </div>
        <div className="w-full text-sm text-slate-700">
          최신 버전 : { latestVersion }
        </div>
        <div className="w-full">
          <button 
            className="inline-flex px-6 py-2 border border-slate-600 cursor-pointer text-sm text-slate-600 hover:bg-slate-200" 
            onClick={() => {
              window.close();
            }}
            >
            아니오
          </button>
          <button 
            className="inline-flex px-6 py-2 border border-slate-600 cursor-pointer text-sm text-slate-600 hover:bg-slate-200"
            onClick={() => {
              electronApi?.sendToMain('download_update', undefined);
            }}
            >
            예
          </button>
        </div>
      </div>
    </div>
  );
}