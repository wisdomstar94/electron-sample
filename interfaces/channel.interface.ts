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

  export interface DownloadProgressChannelPayload {
    progressObj?: ProgressInfo;
  }

  export interface RendererChannelMap { 
    'test_event_2': TestEvent2ChannelPayload;
    'latest_version': LatestVersionChannelPayload;
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
    'test_event_1': TestEvent1ChannelPayload;
    'download_update': DownloadUpdateChannelPayload;
    'execute_update': ExecuteUpdateChannelPayload;
    '': {};
  }

  export type MainChannel = keyof MainChannelMap;
}