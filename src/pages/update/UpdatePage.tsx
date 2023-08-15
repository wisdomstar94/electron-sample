import { Link, Outlet } from "react-router-dom";
import { useElectronApiManager } from "../../hooks/use-electron-api-manager/use-electron-api-manager.hook";

export function UpdatePage() {
  const electronApiManager = useElectronApiManager({
    listenerItems: [
      {
        eventName: 'test_event_2',
        callback: (event, payload) => {
          console.log('@test_event_2', {
            event, payload,
          });
        },
      },
    ],
  });

  return (
    <>
      업데이트 페이지 입니다.
      <div>
        <button 
          onClick={() => {
            electronApiManager.electronApi?.sendToMain('test_event_1', {
              me: 'web',
            });
          }}>ipcMain 에게 test_event_1 이벤트 보내기</button>
      </div>
      <div>
        <Link to="test">하위 test 페이지로..</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}