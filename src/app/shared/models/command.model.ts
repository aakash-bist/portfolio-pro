export interface ParsedInput {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export interface CommandContext {
  args: string[];
  flags: Record<string, string | boolean>;
  currentDirectory: string;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  execute(context: CommandContext): CommandResult;
}

export interface CommandResult {
  output: string;
  isError: boolean;
  clearScreen?: boolean;
  startGui?: boolean;
  downloadFile?: string;
}

export interface TerminalLine {
  prompt?: string;
  command?: string;
  output?: string;
  isError?: boolean;
}
