import { useEffect, useState } from "react";
import { ICommon } from '../../../interfaces/common.interface';

export function useElectronApi() {
  const [electronApi, setElectronApi] = useState<ICommon.ElectronApi>();

  useEffect(() => {
    setElectronApi(window.electronApi);
  }, []);

  return electronApi;
}