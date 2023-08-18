import { useElectronApiManager } from "../../../hooks/use-electron-api-manager/use-electron-api-manager.hook";

export function DownloadedPage() {
  const electronApiManager = useElectronApiManager();

  return (
    <div className="w-full h-full fixed top-0 left-0 flex flex-wrap gap-2 items-center justify-center bg-slate-50">
      <div className="w-full max-w-[320px] relative flex flex-wrap gap-2">
        <div className="w-full">
          업데이트 가능합니다. 업데이트 하시겠습니까? <br />
          (* 앱이 종료됩니다.)
        </div>
        <div className="w-full text-sm text-slate-700 flex flex-wrap gap-2 justify-center items-center">
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
              electronApiManager.electronApi?.sendToMain('execute_update', undefined);
            }}
            >
            예
          </button>
        </div>
      </div>
    </div>
  );
}