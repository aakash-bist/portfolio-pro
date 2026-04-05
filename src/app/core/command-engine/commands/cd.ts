import { CommandFactory } from './command-factory';

export const createCdCommand: CommandFactory = (deps) => ({
  name: 'cd',
  description: 'Change directory',
  usage: 'cd <path>',
  execute: (ctx) => {
    deps.fs.cd(ctx.args[0]);
    return { output: '', isError: false };
  },
});
