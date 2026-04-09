import { Component, inject, signal, computed, OnInit, DestroyRef, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { WindowManagerService } from '../../core/window-manager/window-manager.service';
import { SystemStateService } from '../../core/system-state/system-state.service';
import { WindowType } from '../../shared/models';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  templateUrl: './taskbar.html',
  styleUrl: './taskbar.css',
})
export class TaskbarComponent implements OnInit {
  private readonly wm = inject(WindowManagerService);
  private readonly systemState = inject(SystemStateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly windows = this.wm.windows;
  readonly clock = signal('');
  readonly cpu = this.systemState.cpu;
  readonly memory = this.systemState.memory;
  readonly startMenuOpen = signal(false);
  readonly exitDesktop = output<void>();

  ngOnInit(): void {
    this.updateClock();
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateClock());
  }

  onTaskbarItemClick(id: string): void {
    this.wm.focus(id);
  }

  toggleStartMenu(): void {
    this.startMenuOpen.update(v => !v);
  }

  openApp(type: WindowType, title: string): void {
    this.wm.open(type, title);
    this.startMenuOpen.set(false);
  }

  onExitDesktop(): void {
    this.startMenuOpen.set(false);
    this.wm.closeAll();
    this.exitDesktop.emit();
  }

  private updateClock(): void {
    const now = new Date();
    this.clock.set(
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    );
  }
}
