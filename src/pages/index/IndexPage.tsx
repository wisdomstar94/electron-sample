import { useElectronApiManager } from "../../hooks/use-electron-api-manager/use-electron-api-manager.hook";

export function IndexPage() {
  useElectronApiManager({
    listeners: [
      {
        channel: 'info',
        callback(event, payload) {
          console.log('@info.payload');
          console.log(payload);
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