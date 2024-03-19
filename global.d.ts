import { ICommon } from "./interfaces/common.interface";

declare module global {
  interface Window {
    electronApi?: ICommon.ElectronApi;
  }
}