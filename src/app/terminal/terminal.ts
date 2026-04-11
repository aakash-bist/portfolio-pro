import { Component, ElementRef, ViewChild, AfterViewChecked, computed, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalService } from './terminal.service';
import { ABOUT, SKILLS, PROJECTS, EXPERIENCE, CONTACT } from '../shared/data/portfolio.data';

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

    // Phase 1: Identity from ABOUT
    out('AAKASH_OS BIOS v2.4.1 — POST check...');
    await this.delay(200);
    out(`Name:        ${ABOUT.name.padEnd(20)} Role:    ${ABOUT.role.split('|')[0].trim()}`);
    await this.delay(100);
    out(`Location:    ${ABOUT.location.padEnd(20)} Edu:     ${ABOUT.education.split('—')[0].trim()}`);
    await this.delay(100);
    out(`Awards:      ${ABOUT.awards}`);
    await this.delay(150);
    out('');

    // Phase 2: Loading skills from SKILLS
    out('Loading skill modules...');
    await this.delay(120);

    let totalSkills = 0;
    for (const cat of SKILLS) {
      for (const skill of cat.skills) {
        out(`  ✓ ${skill.name.padEnd(22)} [${cat.name.toLowerCase()}]`);
        totalSkills++;
        await this.delay(35 + Math.random() * 30);
      }
    }
    out(`${totalSkills} modules loaded across ${SKILLS.length} categories.`);
    await this.delay(100);
    out('');

    // Phase 3: Mounting work experience from EXPERIENCE
    out('Mounting work experience...');
    await this.delay(100);
    for (const job of EXPERIENCE) {
      const path = `/exp/${job.company.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
      out(`  ${path.padEnd(24)} ${job.title.padEnd(28)} ${job.period}`);
      await this.delay(55);
    }
    out(`${EXPERIENCE.length} positions mounted.`);
    out('');

    // Phase 4: Indexing projects from PROJECTS
    out('Indexing shipped projects...');
    await this.delay(100);
    for (const p of PROJECTS) {
      out(`  [${p.id}] ${p.name.padEnd(20)} ${p.tech.slice(0, 40).padEnd(42)}`);
      await this.delay(45);
    }
    out(`${PROJECTS.length} projects indexed.`);
    out('');

    // Phase 5: Starting services from CONTACT
    out('Starting services...');
    await this.delay(80);
    out('  portfolio-server ......... running...');
    await this.delay(40);
    for (const c of CONTACT) {
      if (c.href || c.label === 'Email') {
        const svc = `${c.label.toLowerCase()}-link`;
        out(`  ${svc.padEnd(25)} ${c.value}`);
        await this.delay(40);
      }
    }
    await this.delay(80);
    out('');
    out('All systems operational.');
    out(`AAKASH_PORTFOLIO v1.0.0 — ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`);
    await this.delay(150);

    const isMobile = window.innerWidth < 600;

    const banner = isMobile ? [
      '',
      '  A A K A S H',
      '  P O R T F O L I O',
      '',
      '  Full-Stack Developer',
      '  Noida, India',
      '',
      '  ─────────────────────────',
      '',
      '  > help     - commands',
      '  > about    - about me',
      '  > projects - my work',
      '  > resume   - download',
      '  > startx   - launch GUI',
      '',
    ].join('\n') : [
      '',
      '     █████╗  █████╗ ██╗  ██╗ █████╗ ███████╗██╗  ██╗',
      '    ██╔══██╗██╔══██╗██║ ██╔╝██╔══██╗██╔════╝██║  ██║',
      '    ███████║███████║█████╔╝ ███████║███████╗███████║',
      '    ██╔══██║██╔══██║██╔═██╗ ██╔══██║╚════██║██╔══██║',
      '    ██║  ██║██║  ██║██║  ██╗██║  ██║███████║██║  ██║',
      '    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝',
      '',
      '   Portfolio Experience | Full-Stack Developer',
      '',
      '   ──────────────────────────────────────────────',
      '',
      '   Type "help" to see available commands',
      '   Type "about" to learn more about me',
      '   Type "projects" to view my work',
      '   Type "resume" to download my resume',
      '   Type "startx" to launch desktop GUI',
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
