import { ProgressInfo } from "electron-updater";

// main 에서 renderer 로 보내는 채널에 대한 인터페이스
export declare namespace IChannelMainToRenderer {
  export interface TestEvent2Payload {
    key1: string;
  }

  export interface LatestVersionPayload {
    currentVersion?: string;
    latestVersion?: string;
  }

  export interface InfoPayload {
    currentVersion?: string;
    isDev?: boolean;
  }

  export interface CommandResultPayload {
    stdout: string;
    stderr: string;
  }

  export interface DownloadProgressPayload {
    progressObj?: ProgressInfo;
  }

  export interface ChannelMap { 
    'latest_version': LatestVersionPayload;
    'info': InfoPayload;
    'command_result': CommandResultPayload;
    'download_progress': DownloadProgressPayload;
    '': {};
  }

  export type Channel = keyof ChannelMap;
}