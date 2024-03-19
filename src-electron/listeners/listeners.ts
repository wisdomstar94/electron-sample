import { IChannel } from '../../interfaces/channel.interface';
import { commandExecute } from '../utils/common';
import { mainManager } from '../utils/main-manager';

// mainManager.listen('test_event_1', (event, payload) => {
//   console.log('@test_event_1');
//   console.log('@test_event_1.payload.key3', payload.key3);
//   mainManager.reply(event, 'test_event_2', {
//     key1: 'this is key1!!!',
//   });
// });

mainManager.listen('command_exec', async(event, payload) => {
  const command = payload.command;
  const result = await commandExecute(command);
  event.reply('command_result', {
    stdout: result.stdout,
    stderr: result.stderr,
  } as IChannel.RendererChannelMap['command_result']);
});