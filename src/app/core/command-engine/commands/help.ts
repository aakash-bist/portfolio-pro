import { Command, CommandContext, CommandResult } from '../../../shared/models';
import { CommandDeps, CommandFactory } from './command-factory';

export const createHelpCommand: CommandFactory = (deps) => ({
  name: 'help',
  description: 'List available commands',
  usage: 'help [command]',
  execute(ctx: CommandContext): CommandResult {
    if (ctx.args.length > 0) {
      const target = deps.getCommand(ctx.args[0]);
      if (!target) {
        return { output: `help: no help for '${ctx.args[0]}'`, isError: true };
      }
      return { output: `${target.name} - ${target.description}\nUsage: ${target.usage}`, isError: false };
    }

    const lines = deps.getCommands()
      .map(cmd => `  ${cmd.name.padEnd(12)} ${cmd.description}`)
      .join('\n');

    return { output: `Available commands:\n${lines}`, isError: false };
  },
});
