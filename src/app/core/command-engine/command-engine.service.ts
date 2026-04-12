import { inject, Injectable } from '@angular/core';
import { Command, CommandContext, CommandResult } from '../../shared/models';
import { FileSystemService } from '../filesystem/filesystem.service';
import { SystemStateService } from '../system-state/system-state.service';
import { parseInput } from './parser';
import { CommandDeps, CommandFactory } from './commands/command-factory';
import {
  createHelpCommand,
  createLsCommand,
  createCdCommand,
  createPwdCommand,
  createCatCommand,
  createClearCommand,
  createSystemCommand,
  createAboutCommand,
  createProjectsCommand,
  createSkillsCommand,
  createContactCommand,
  createStartxCommand,
  createResumeCommand,
  createExperienceCommand,
} from './commands';

@Injectable({ providedIn: 'root' })
export class CommandEngineService {
  private readonly registry = new Map<string, Command>();
  private readonly fs = inject(FileSystemService);
  private readonly systemState = inject(SystemStateService);

  private readonly deps: CommandDeps = {
    fs: this.fs,
    systemState: this.systemState,
    getCommands: () => this.getRegisteredCommands(),
    getCommand: (name: string) => this.registry.get(name),
  };

  private readonly defaultFactories: CommandFactory[] = [
    createHelpCommand,
    createLsCommand,
    createCdCommand,
    createPwdCommand,
    createCatCommand,
    createClearCommand,
    createSystemCommand,
    createAboutCommand,
    createProjectsCommand,
    createSkillsCommand,
    createContactCommand,
    createStartxCommand,
    createResumeCommand,
    createExperienceCommand,
  ];

  constructor() {
    this.defaultFactories.forEach(factory => this.register(factory(this.deps)));
  }

  register(command: Command): void {
    this.registry.set(command.name, command);
  }

  execute(raw: string, currentDirectory: string): CommandResult {
    const parsed = parseInput(raw);

    if (!parsed.command) {
      return { output: '', isError: false };
    }

    const command = this.registry.get(parsed.command);

    if (!command) {
      return { output: this.getWittyResponse(parsed.command), isError: true };
    }

    const context: CommandContext = {
      args: parsed.args,
      flags: parsed.flags,
      currentDirectory,
    };

    try {
      return command.execute(context);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : `${parsed.command}: unexpected error`;
      return { output: msg, isError: true };
    }
  }

  getRegisteredCommands(): Command[] {
    return Array.from(this.registry.values());
  }

  private readonly wittyResponses = [
    (cmd: string) => `${cmd}: permission denied. Nice try though — this isn't your terminal. 😏`,
    (cmd: string) => `${cmd}: command not found. Did you really think I'd let you run that? Type "help" for what you CAN do.`,
    (cmd: string) => `sudo ${cmd}? Just kidding, sudo doesn't work here either. 🔒`,
    (cmd: string) => `${cmd}: access denied. This OS runs on vibes, not root access.`,
    (cmd: string) => `${cmd}: nope. You're a guest here — act like one. Try "help".`,
    (cmd: string) => `${cmd}: command not found. I barely trust myself with this terminal, let alone you.`,
    (cmd: string) => `${cmd}: ERR_NOT_GONNA_HAPPEN. But "help" will show you what's on the menu.`,
    (cmd: string) => `${cmd}: nice command. Wrong OS. This one only does cool stuff — type "help".`,
    (cmd: string) => `${cmd}: intercepted by AAKASH_OS firewall. Threat level: amusing. 🛡️`,
    (cmd: string) => `${cmd}: I could run that... but I won't. Try "help" instead.`,
  ];

  private getWittyResponse(cmd: string): string {
    const index = Math.floor(Math.random() * this.wittyResponses.length);
    return this.wittyResponses[index](cmd);
  }
}
