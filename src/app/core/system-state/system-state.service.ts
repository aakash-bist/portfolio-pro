import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class SystemStateService {
  private readonly destroyRef = inject(DestroyRef);

  readonly uptime = signal(0);
  readonly cpu = signal(12);
  readonly memory = signal(34);

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.uptime.update(v => v + 1);
        this.cpu.set(this.clamp(this.cpu() + (Math.random() * 10 - 5), 3, 95));
        this.memory.set(this.clamp(this.memory() + (Math.random() * 4 - 2), 20, 85));
      });
  }

  getSystemStatus(): string {
    const uptimeStr = this.formatUptime(this.uptime());
    const cpuStr = this.cpu().toFixed(1);
    const memStr = this.memory().toFixed(1);

    return [
      'AAKASH_OS v1.0.0',
      '─────────────────────────────',
      `Uptime:   ${uptimeStr}`,
      `CPU:      ${this.bar(this.cpu())} ${cpuStr}%`,
      `Memory:   ${this.bar(this.memory())} ${memStr}%`,
      `User:     aakash`,
      `Hostname: portfolio`,
      `Shell:    /bin/aakash-sh`,
      '─────────────────────────────',
    ].join('\n');
  }

  private formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private bar(pct: number): string {
    const filled = Math.round(pct / 5);
    const empty = 20 - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }

  private clamp(val: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, val));
  }
}
