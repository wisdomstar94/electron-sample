// renderer 에서 main 로 보내는 채널에 대한 인터페이스
export declare namespace IChannelRendererToMain {
  export interface TestEvent1Payload {
    key3: string;
  }

  export type ExecuteUpdatePayload = undefined;

  export type DownloadUpdatePayload = undefined;

  export type CommandExecPayload = {
    command: string;
  };

  export interface ChannelMap {
    'download_update': DownloadUpdatePayload;
    'execute_update': ExecuteUpdatePayload;
    'command_exec': CommandExecPayload;
    '': {};
  }

  export type Channel = keyof ChannelMap;
}