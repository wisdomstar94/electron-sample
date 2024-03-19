import { useMemo, useState } from "react";
import { useElectronListener } from "../../hooks/use-electron-listener/use-electron-listener.hook";
import { IUseElectronListener } from "../../hooks/use-electron-listener/use-electron-listener.interface";
import { useElectronApi } from "../../hooks/use-electron-api/use-electron-api.hook";

export function CommandPage() {
  const [command, setCommand] = useState('nvm --version');
  const electronApi = useElectronApi();
  const listener = useMemo<IUseElectronListener.Listener<'command_result'>>(() => {
    return {
      channel: 'command_result',
      callback(event, payload) {
        console.log('@@command_result.payload', payload);
      },
    };
  }, []);
  useElectronListener({ listener });

  console.log('@@ render');

  return (
    <>
      <div className="w-full relative mb-2">
        command page! 
      </div>

      <div className="w-full relative">
        <input type="text" value={command} onChange={e => setCommand(e.target.value)} />
        <button  
          className="inline-flex px-2 py-0.5 text-xs text-slate-700 border border-slate-400 cursor-pointer hover:bg-slate-100 rounded-sm"
          onClick={() => {
            electronApi?.sendToMain('command_exec', {
              command
            });
          }}>
          /command 날리기
        </button>
      </div>
    </>
  );
}