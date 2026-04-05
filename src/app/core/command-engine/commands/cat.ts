import { CommandFactory } from './command-factory';

export const createCatCommand: CommandFactory = (deps) => ({
  name: 'cat',
  description: 'Display file contents',
  usage: 'cat <file>',
  execute: (ctx) => {
    if (ctx.args.length === 0) {
      return { output: 'cat: missing file operand', isError: true };
    }
    return { output: deps.fs.cat(ctx.args[0]), isError: false };
  },
});
