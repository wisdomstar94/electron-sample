import { Link } from "react-router-dom";
import { useElectronApiManager } from "../../hooks/use-electron-api-manager/use-electron-api-manager.hook";

export function IndexPage() {
  useElectronApiManager({
    listeners: [
      {
        channel: 'current_version',
        callback(event, payload) {
          console.log('@current_version.payload', payload);
        },
      },
    ],
  });

  return (
    <>
      <div>
        <Link to="/update">하위 update 페이지로..</Link>
      </div>
    </>
  );
}