import { CommandFactory } from './command-factory';

export const createSystemCommand: CommandFactory = (deps) => ({
  name: 'system',
  description: 'Display system status',
  usage: 'system [--status]',
  execute: () => ({ output: deps.systemState.getSystemStatus(), isError: false }),
});
