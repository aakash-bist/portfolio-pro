import { CommandFactory } from './command-factory';

export const createPwdCommand: CommandFactory = (deps) => ({
  name: 'pwd',
  description: 'Print working directory',
  usage: 'pwd',
  execute: () => ({ output: deps.fs.pwd(), isError: false }),
});
