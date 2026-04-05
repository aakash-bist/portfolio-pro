import { CommandFactory } from './command-factory';

export const createClearCommand: CommandFactory = () => ({
  name: 'clear',
  description: 'Clear terminal screen',
  usage: 'clear',
  execute: () => ({ output: '', isError: false, clearScreen: true }),
});
