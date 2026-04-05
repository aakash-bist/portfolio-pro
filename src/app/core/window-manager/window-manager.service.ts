import { Injectable, signal, computed } from '@angular/core';
import { WindowState, WindowType } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  private readonly _windows = signal<WindowState[]>([]);
  private nextZIndex = 1;
  private windowCounter = 0;

  readonly windows = this._windows.asReadonly();
  readonly activeWindow = computed(() =>
    this._windows().reduce<WindowState | null>(
      (top, w) => (!w.minimized && (!top || w.zIndex > top.zIndex) ? w : top),
      null,
    ),
  );

  open(type: WindowType, title: string): string {
    const id = `win-${++this.windowCounter}`;
    const offset = (this.windowCounter % 8) * 30;
    const win: WindowState = {
      id,
      title,
      type,
      x: 80 + offset,
      y: 40 + offset,
      width: type === 'terminal' ? 800 : 600,
      height: type === 'terminal' ? 500 : 450,
      minimized: false,
      maximized: false,
      focused: true,
      zIndex: this.nextZIndex++,
    };

    this._windows.update(wins => {
      const unfocused = wins.map(w => ({ ...w, focused: false }));
      return [...unfocused, win];
    });

    return id;
  }

  close(id: string): void {
    this._windows.update(wins => wins.filter(w => w.id !== id));
  }

  focus(id: string): void {
    this._windows.update(wins =>
      wins.map(w => ({
        ...w,
        focused: w.id === id,
        zIndex: w.id === id ? this.nextZIndex++ : w.zIndex,
        minimized: w.id === id ? false : w.minimized,
      })),
    );
  }

  minimize(id: string): void {
    this._windows.update(wins =>
      wins.map(w => (w.id === id ? { ...w, minimized: true, focused: false } : w)),
    );
  }

  toggleMaximize(id: string): void {
    this._windows.update(wins =>
      wins.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );
  }

  move(id: string, x: number, y: number): void {
    this._windows.update(wins =>
      wins.map(w => (w.id === id ? { ...w, x, y } : w)),
    );
  }

  resize(id: string, width: number, height: number): void {
    this._windows.update(wins =>
      wins.map(w => (w.id === id ? { ...w, width: Math.max(300, width), height: Math.max(200, height) } : w)),
    );
  }

  closeAll(): void {
    this._windows.set([]);
    this.windowCounter = 0;
    this.nextZIndex = 1;
  }
}
