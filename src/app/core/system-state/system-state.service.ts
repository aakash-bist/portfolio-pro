import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface PerformanceMemory {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
}

@Injectable({ providedIn: 'root' })
export class SystemStateService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly uptime = signal(0);
  readonly cpu = signal(0);
  readonly memory = signal(0);

  private lastFrameTime = 0;
  private frameTimes: number[] = [];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.lastFrameTime = performance.now();
      this.measureFrames();
    }

    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.uptime.update(v => v + 1);
        this.updateMemory();
        this.updateCpu();
      });
  }

  private measureFrames(): void {
    const loop = () => {
      const now = performance.now();
      this.frameTimes.push(now - this.lastFrameTime);
      if (this.frameTimes.length > 60) this.frameTimes.shift();
      this.lastFrameTime = now;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private updateMemory(): void {
    const perf = performance as unknown as { memory?: PerformanceMemory };
    if (perf.memory) {
      const pct = (perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100;
      this.memory.set(Math.round(pct * 10) / 10);
    }
  }

  private updateCpu(): void {
    if (this.frameTimes.length === 0) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    // 16.67ms = 60fps = idle. Higher avg frame time = more CPU busy
    const load = this.clamp(((avg - 8) / 50) * 100, 1, 99);
    this.cpu.set(Math.round(load * 10) / 10);
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
