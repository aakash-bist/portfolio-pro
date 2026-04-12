import { Component, ElementRef, ViewChild, AfterViewChecked, computed, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalService } from './terminal.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.css',
})
export class TerminalComponent implements OnInit, AfterViewChecked {
  @ViewChild('outputContainer') private outputContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('inputEl') private inputEl!: ElementRef<HTMLInputElement>;

  private readonly terminalService = inject(TerminalService);
  private readonly platformId = inject(PLATFORM_ID);
  private shouldScroll = false;

  readonly lines = this.terminalService.output;
  readonly history = this.terminalService.history;
  readonly prompt = this.terminalService.prompt;
  readonly currentInput = signal('');
  readonly booted = signal(false);
  readonly quickCommands = ['help', 'about', 'projects', 'skills', 'contact', 'resume', 'startx'];
  readonly commandCount = computed(() => this.history().length);
  readonly outputCount = computed(() => this.lines().filter(line => !!line.output).length);
  readonly activeSuggestion = computed(() => {
    const input = this.currentInput().trim().toLowerCase();
    if (!input) return this.quickCommands[0];
    return this.quickCommands.find(cmd => cmd.startsWith(input)) ?? '';
  });

  private historyIndex = -1;
  private savedInput = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Keep the existing terminal session when returning from desktop mode.
    if (this.lines().length > 0) {
      this.booted.set(true);
      this.shouldScroll = true;
      setTimeout(() => this.focusInput(), 50);
      return;
    }

    this.runBootSequence();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.booted()) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      this.terminalService.clear();
      this.shouldScroll = true;
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const completed = this.terminalService.tabComplete(this.currentInput());
      this.currentInput.set(completed);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.submitCommand();
    }
  }

  focusInput(): void {
    this.inputEl?.nativeElement.focus();
  }

  fillQuickCommand(command: string): void {
    this.currentInput.set(command);
    this.focusInput();
  }

  runQuickCommand(command: string): void {
    this.currentInput.set(command);
    this.submitCommand();
    this.focusInput();
  }

  private submitCommand(): void {
    const input = this.currentInput().trim();

    if (input) {
      this.terminalService.executeCommand(input);
    } else {
      this.terminalService.addOutput({ prompt: this.prompt() });
    }

    this.currentInput.set('');
    this.historyIndex = -1;
    this.savedInput = '';
    this.shouldScroll = true;
  }

  private navigateHistory(direction: number): void {
    const history = this.terminalService.history();
    if (history.length === 0) return;

    if (this.historyIndex === -1) {
      this.savedInput = this.currentInput();
    }

    const newIndex = this.historyIndex + direction;

    if (newIndex < 0) {
      this.historyIndex = -1;
      this.currentInput.set(this.savedInput);
      return;
    }

    if (newIndex >= history.length) return;

    this.historyIndex = newIndex;
    this.currentInput.set(history[history.length - 1 - newIndex]);
  }

  private scrollToBottom(): void {
    const el = this.outputContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  private async runBootSequence(): Promise<void> {
    const out = (text: string) => {
      this.terminalService.addOutput({ output: text });
      this.shouldScroll = true;
    };

    const isMobile = window.innerWidth < 600;

    // ── Boot sequence ──
    out('Booting AAKASH_OS v2.4.1...');
    await this.delay(300);
    out('');

    const pad = (text: string, width: number) => text + ' '.repeat(Math.max(0, width - text.length));
    const cols = isMobile ? 36 : 56;
    const ok = '[ OK ]';

    const groups: { label: string; steps: string[] }[] = [
      { label: '[ Core ]', steps: ['Initializing modules...', 'Mounting filesystem...'] },
      { label: '[ Data ]', steps: ['Connecting pipelines...', 'Syncing projects...'] },
      { label: '[ User ]', steps: ['Loading profile...', 'Establishing session...'] },
    ];

    for (const group of groups) {
      out(group.label);
      for (const step of group.steps) {
        const line = '  ✔ ' + pad(step, cols - 4 - ok.length) + ok;
        out(line);
        await this.delay(200);
      }
      out('');
      out('');
      await this.delay(150);
    }

    out('System ready.');
    await this.delay(200);
    this.terminalService.addOutput({ prompt: this.terminalService.prompt(), command: 'whoami' });
    await this.delay(300);
    // out('Aakash — Full Stack Developer | Analytics Systems');
    await this.delay(200);

    if (isMobile) {
      const banner = [
        '',
        '  ▄▀█ ▄▀█ █▄▀ ▄▀█ █▀ █ █',
        '  █▀█ █▀█ █ █ █▀█ ▄█ █▀█',
        '',
        '      █▄▄ █ █▀ ▀█▀',
        '      █▄█ █ ▄█  █',
        '',
        '  Full-Stack Developer',
        '  Noida, India',
        '',
        '  Type "help" to get started.',
        '',
      ].join('\n');
      this.terminalService.addOutput({ output: banner });
    } else {
      const bannerLines = [
        '     █████╗  █████╗ ██╗  ██╗ █████╗ ███████╗██╗  ██╗',
        '    ██╔══██╗██╔══██╗██║ ██╔╝██╔══██╗██╔════╝██║  ██║',
        '    ███████║███████║█████╔╝ ███████║███████╗███████║',
        '    ██╔══██║██╔══██║██╔═██╗ ██╔══██║╚════██║██╔══██║',
        '    ██║  ██║██║  ██║██║  ██╗██║  ██║███████║██║  ██║',
        '    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝',
        '',
        '    ██████╗ ██╗███████╗████████╗',
        '    ██╔══██╗██║██╔════╝╚══██╔══╝',
        '    ██████╔╝██║███████╗   ██║',
        '    ██╔══██╗██║╚════██║   ██║',
        '    ██████╔╝██║███████║   ██║',
        '    ╚═════╝ ╚═╝╚══════╝   ╚═╝',
      ];
      const banner = '\n' + bannerLines.join('\n') + '\n\n    Full-Stack Developer | Noida, India\n\n    Type "help" to get started.\n';
      this.terminalService.addOutput({ output: banner });
    }
    this.shouldScroll = true;

    await this.delay(100);
    this.booted.set(true);

    setTimeout(() => this.focusInput(), 50);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
