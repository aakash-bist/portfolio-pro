import { CommandResult } from '../../../shared/models';
import { CommandFactory } from './command-factory';

export const createLsCommand: CommandFactory = (deps) => ({
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [path]',
  execute: (ctx) => ({ output: deps.fs.ls(ctx.args[0]), isError: false }),
});
