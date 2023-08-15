import { ICommon } from "../interfaces/common.interface";

const ValidListenChannel: ICommon.ValidListenChannel[] = [
  'test_event_2',
];

const ValidSendChannel: ICommon.ValidSendChannel[] = [
  'test_event_1',
];

export const Constraint = {
  ValidListenChannel,
  ValidSendChannel,
};