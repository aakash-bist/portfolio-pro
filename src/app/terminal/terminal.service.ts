import { computed, inject, Injectable, signal } from '@angular/core';
import { CommandEngineService } from '../core/command-engine/command-engine.service';
import { FileSystemService } from '../core/filesystem/filesystem.service';
import { TerminalLine } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class TerminalService {
  private readonly commandEngine = inject(CommandEngineService);
  private readonly fs = inject(FileSystemService);

  private readonly _output = signal<TerminalLine[]>([]);
  private readonly _history = signal<string[]>([]);
  private readonly _startGui = signal(false);

  readonly output = this._output.asReadonly();
  readonly history = this._history.asReadonly();
  readonly startGui = this._startGui.asReadonly();
  readonly prompt = computed(() => `aakash@portfolio:${this.shortPath()}$`);

  executeCommand(input: string): void {
    if (!input) return;

    this._history.update(h => [...h, input]);
    this.addOutput({ prompt: this.prompt(), command: input });

    const result = this.commandEngine.execute(input, this.fs.pwd());

    if (result.clearScreen) {
      this.clear();
      return;
    }

    if (result.output) {
      this.addOutput({ output: result.output, isError: result.isError });
    }

    if (result.startGui) {
      this._startGui.set(true);
    }

    if (result.downloadFile) {
      this.triggerDownload(result.downloadFile);
    }
  }

  resetGui(): void {
    this._startGui.set(false);
  }

  private triggerDownload(url: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  }

  addOutput(line: TerminalLine): void {
    this._output.update(lines => [...lines, line]);
  }

  clear(): void {
    this._output.set([]);
  }

  private shortPath = computed(() => {
    const cwd = this.fs.pwd();
    return cwd.replace('/home/aakash', '~');
  });

  tabComplete(input: string): string {
    if (!input) return input;

    const parts = input.split(' ');

    // Complete command name if only one token
    if (parts.length === 1) {
      const prefix = parts[0];
      const matches = this.commandEngine.getRegisteredCommands()
        .map(c => c.name)
        .filter(n => n.startsWith(prefix));

      if (matches.length === 1) return matches[0] + ' ';
      return input;
    }

    // Complete file/dir argument (last token)
    const lastPart = parts[parts.length - 1];
    const matches = this.fs.getCompletions(lastPart);

    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      return parts.join(' ');
    }

    if (matches.length > 1) {
      // Find common prefix
      const common = this.commonPrefix(matches);
      if (common.length > lastPart.length) {
        parts[parts.length - 1] = common;
        return parts.join(' ');
      }
    }

    return input;
  }

  private commonPrefix(strings: string[]): string {
    if (strings.length === 0) return '';
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (!strings[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
    }
    return prefix;
  }
}
