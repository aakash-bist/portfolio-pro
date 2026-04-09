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

    // Phase 1: Hardware (portfolio stats as system specs)
    out('AAKASH_OS BIOS v2.4.1 — POST check...');
    await this.delay(200);
    out('Experience:  6+ years         Status: Active');
    await this.delay(100);
    out('Stack:       MEAN / MERN      Mode:   Full-Stack');
    await this.delay(100);
    out('Projects:    5 shipped        Awards: 2x SIH Winner');
    await this.delay(150);
    out('');

    // Phase 2: Loading skill modules
    out('Loading skill modules...');
    await this.delay(120);

    const modules = [
      { mod: 'angular@latest',      tag: 'frontend',   status: 'active' },
      { mod: 'react@18',            tag: 'frontend',   status: 'active' },
      { mod: 'nodejs@20-lts',       tag: 'backend',    status: 'active' },
      { mod: 'nestjs@10',           tag: 'backend',    status: 'active' },
      { mod: 'mongodb@7',           tag: 'database',   status: 'active' },
      { mod: 'postgresql@16',       tag: 'database',   status: 'active' },
      { mod: 'redis@7',             tag: 'cache',      status: 'active' },
      { mod: 'elasticsearch@8',     tag: 'search',     status: 'active' },
      { mod: 'docker@24',           tag: 'devops',     status: 'active' },
      { mod: 'tailwindcss@3',       tag: 'styling',    status: 'active' },
    ];

    for (const m of modules) {
      out(`  ✓ ${m.mod.padEnd(24)} [${m.tag}]`);
      await this.delay(45 + Math.random() * 40);
    }
    out(`${modules.length} modules loaded.`);
    await this.delay(100);
    out('');

    // Phase 3: Mounting work experience
    out('Mounting work experience...');
    await this.delay(100);
    out('  /exp/supplycopia      Sr. Software Developer    2025–present');
    await this.delay(60);
    out('  /exp/algoscale        Team Lead (MEAN Stack)    2021–2025');
    await this.delay(60);
    out('  /exp/e-tech           MEAN Stack Developer      2020–2021');
    await this.delay(60);
    out('  /exp/planify          Frontend Developer        2019');
    await this.delay(80);
    out('Experience timeline mounted.');
    out('');

    // Phase 4: Indexing projects
    out('Indexing shipped projects...');
    await this.delay(100);
    out('  [1] SC Analytics       Angular · Redshift · Redis       ● live');
    await this.delay(50);
    out('  [2] MR Reporting       Angular · Loopback · MongoDB     ● live   2000+ users');
    await this.delay(50);
    out('  [3] Dhaam Organics     React · Node.js · Cloudinary     ● live');
    await this.delay(50);
    out('  [4] STET Sikkim        Angular · Node.js · MongoDB      ● live   SIH Winner');
    await this.delay(50);
    out('  [5] AAKASH_OS          Angular · TypeScript              ◌ dev    you are here');
    await this.delay(80);
    out('Project index built.');
    out('');

    // Phase 5: System ready
    out('Starting services...');
    await this.delay(80);
    out('  portfolio-server ......... running on :443');
    await this.delay(50);
    out('  contact-bridge ........... aakashbist@outlook.com');
    await this.delay(50);
    out('  github-link .............. github.com/aakash-bist');
    await this.delay(50);
    out('  linkedin-link ............ linkedin.com/in/aakash-bist');
    await this.delay(80);
    out('');
    out('All systems operational.');
    out(`AAKASH_PORTFOLIO v1.0.0 — ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`);
    await this.delay(150);

    const isMobile = window.innerWidth < 600;

    const banner = isMobile ? [
      '',
      '  ┌───────────────────────────────┐',
      '  │                               │',
      '  │      A A K A S H              │',
      '  │      P O R T F O L I O        │',
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
      '  ║   Portfolio Experience | Full-Stack Developer         ║',
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
