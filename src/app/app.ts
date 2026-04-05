import { Component, computed, effect, inject } from '@angular/core';
import { TerminalComponent } from './terminal/terminal';
import { DesktopComponent } from './desktop/desktop';
import { TerminalService } from './terminal/terminal.service';

@Component({
  selector: 'app-root',
  imports: [TerminalComponent, DesktopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly terminalService = inject(TerminalService);
  readonly showDesktop = computed(() => this.terminalService.startGui());

  exitDesktop(): void {
    this.terminalService.resetGui();
  }
}
