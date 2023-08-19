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
      index page!
    </>
  );
}