import { Component, inject, output } from '@angular/core';
import { WindowManagerService } from '../core/window-manager/window-manager.service';
import { WindowComponent } from './window/window';
import { TaskbarComponent } from './taskbar/taskbar';
import { DesktopIconsComponent } from './desktop-icons/desktop-icons';
import { TerminalComponent } from '../terminal/terminal';
import { WinAboutComponent } from './window-content/win-about';
import { WinProjectsComponent } from './window-content/win-projects';
import { WinSkillsComponent } from './window-content/win-skills';
import { WinContactComponent } from './window-content/win-contact';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    WindowComponent,
    TaskbarComponent,
    DesktopIconsComponent,
    TerminalComponent,
    WinAboutComponent,
    WinProjectsComponent,
    WinSkillsComponent,
    WinContactComponent,
  ],
  templateUrl: './desktop.html',
  styleUrl: './desktop.css',
})
export class DesktopComponent {
  private readonly wm = inject(WindowManagerService);
  readonly windows = this.wm.windows;
  readonly exitDesktop = output<void>();

  onClose(id: string): void {
    this.wm.close(id);
  }

  onFocus(id: string): void {
    this.wm.focus(id);
  }

  onMinimize(id: string): void {
    this.wm.minimize(id);
  }

  onMaximize(id: string): void {
    this.wm.toggleMaximize(id);
  }

  onMove(event: { id: string; x: number; y: number }): void {
    this.wm.move(event.id, event.x, event.y);
  }

  onResize(event: { id: string; width: number; height: number }): void {
    this.wm.resize(event.id, event.width, event.height);
  }
}
