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
  readonly prompt = this.terminalService.prompt;
  readonly currentInput = signal('');
  readonly booted = signal(false);

  private historyIndex = -1;
  private savedInput = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.runBootSequence();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.booted()) return;
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
    const bootLines = [
      { text: 'BIOS v2.4.1 — POST check...', delay: 300 },
      { text: 'Memory:    512 MB OK', delay: 200 },
      { text: 'CPU:       AAKASH-CORE @ 3.6 GHz', delay: 200 },
      { text: 'Disk:      /dev/sda1  128 GB', delay: 200 },
      { text: '', delay: 100 },
      { text: 'Loading kernel.............. done', delay: 400 },
      { text: 'Mounting filesystem......... done', delay: 300 },
      { text: 'Starting network........... done', delay: 250 },
      { text: 'Initializing services...... done', delay: 300 },
      { text: '', delay: 100 },
      { text: 'AAKASH_OS v1.0.0 (tty1)', delay: 200 },
      { text: '', delay: 100 },
      { text: `Last login: ${new Date().toString().slice(0, 24)} on tty1`, delay: 300 },
      { text: '', delay: 100 },
    ];

    for (const line of bootLines) {
      await this.delay(line.delay);
      this.terminalService.addOutput({ output: line.text });
      this.shouldScroll = true;
    }

    await this.delay(200);

    const isMobile = window.innerWidth < 600;

    const banner = isMobile ? [
      '',
      '  ┌───────────────────────────────┐',
      '  │                               │',
      '  │      A A K A S H              │',
      '  │      B I S T                  │',
      '  │                               │',
      '  │      Full-Stack Developer     │',
      '  │      Noida, India             │',
      '  │                               │',
      '  ├───────────────────────────────┤',
      '  │                               │',
      '  │   > help     - commands       │',
      '  │   > about    - about me       │',
      '  │   > projects - my work        │',
      '  │   > resume   - download       │',
      '  │   > startx   - launch GUI     │',
      '  │                               │',
      '  └───────────────────────────────┘',
      '',
    ].join('\n') : [
       '',
      '  ╔══════════════════════════════════════════════════════╗',
      '  ║                                                      ║',
      '  ║     █████╗  █████╗ ██╗  ██╗ █████╗ ███████╗██╗  ██╗  ║',
      '  ║    ██╔══██╗██╔══██╗██║ ██╔╝██╔══██╗██╔════╝██║  ██║  ║',
      '  ║    ███████║███████║█████╔╝ ███████║███████╗███████║  ║',
      '  ║    ██╔══██║██╔══██║██╔═██╗ ██╔══██║╚════██║██╔══██║  ║',
      '  ║    ██║  ██║██║  ██║██║  ██╗██║  ██║███████║██║  ██║  ║',
      '  ║    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝  ║',
      '  ║                                                      ║',
      '  ║        Full-Stack Developer | India                  ║',
      '  ║                                                      ║',
      '  ╠══════════════════════════════════════════════════════╣',
      '  ║                                                      ║',
      '  ║   Type "help" to see available commands              ║',
      '  ║   Type "about" to learn more about me                ║',
      '  ║   Type "projects" to view my work                    ║',
      '  ║   Type "resume" to download my resume                ║',
      '  ║   Type "startx" to launch desktop GUI                ║',
      '  ║                                                      ║',
      '  ╚══════════════════════════════════════════════════════╝',
      '',
    ].join('\n');

    this.terminalService.addOutput({ output: banner });
    this.shouldScroll = true;

    await this.delay(100);
    this.booted.set(true);

    setTimeout(() => this.focusInput(), 50);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
