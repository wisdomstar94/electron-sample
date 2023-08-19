import { ProgressInfo } from "electron-updater";

export declare namespace IChannel {
  /**
   * ************************************************************
   * Render Channel
   * ************************************************************
   */
  export interface TestEvent2ChannelPayload {
    key1: string;
  }

  export interface LatestVersionChannelPayload {
    currentVersion?: string;
    latestVersion?: string;
  }

  export interface InfoChannelPayload {
    currentVersion?: string;
    isDev?: boolean;
  }

  export interface DownloadProgressChannelPayload {
    progressObj?: ProgressInfo;
  }

  export interface RendererChannelMap { 
    'latest_version': LatestVersionChannelPayload;
    'info': InfoChannelPayload;
    'download_progress': DownloadProgressChannelPayload;
    '': {};
  }

  export type RendererChannel = keyof RendererChannelMap;

  /**
   * ************************************************************
   * Main Channel
   * ************************************************************
   */
  export interface TestEvent1ChannelPayload {
    key3: string;
  }

  export type ExecuteUpdateChannelPayload = undefined;

  export type DownloadUpdateChannelPayload = undefined;

  export interface MainChannelMap {
    'download_update': DownloadUpdateChannelPayload;
    'execute_update': ExecuteUpdateChannelPayload;
    '': {};
  }

  export type MainChannel = keyof MainChannelMap;
}