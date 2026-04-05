import { Command } from '../../../shared/models';
import { FileSystemService } from '../../filesystem/filesystem.service';
import { SystemStateService } from '../../system-state/system-state.service';

export type CommandFactory = (deps: CommandDeps) => Command;

export interface CommandDeps {
  fs: FileSystemService;
  systemState: SystemStateService;
  getCommands: () => Command[];
  getCommand: (name: string) => Command | undefined;
}
