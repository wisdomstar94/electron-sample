import { useState } from "react";
import { useElectronApiManager } from "../../../hooks/use-electron-api-manager/use-electron-api-manager.hook";
import { ProgressInfo } from "electron-updater";

export function DownloadingPage() {
  const [progressObj, setProgressObj] = useState<ProgressInfo>();

  useElectronApiManager({
    listeners: [
      {
        channel: 'download_progress',
        callback(event, payload) {
          setProgressObj(payload.progressObj);
        },
      }
    ],
  });

  return (
    <div className="w-full h-full fixed top-0 left-0 flex flex-wrap gap-2 items-center justify-center bg-slate-50">
      <div className="w-full max-w-[320px] relative flex flex-wrap gap-2">
        <div className="w-full text-slate-600">
          업데이트에 필요한 파일을 다운로드 중입니다.
        </div>
        <div className="w-full text-sm text-slate-600 tabular-nums">
          { `${Math.floor(Number(progressObj?.percent ?? 0))}%` } / 100%
        </div>
      </div>
    </div>
  );
}