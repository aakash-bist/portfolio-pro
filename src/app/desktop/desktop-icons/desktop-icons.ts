import { Component, HostListener, inject, signal } from '@angular/core';
import { WindowManagerService } from '../../core/window-manager/window-manager.service';
import { DesktopIcon } from '../../shared/models';

@Component({
  selector: 'app-desktop-icons',
  standalone: true,
  templateUrl: './desktop-icons.html',
  styleUrl: './desktop-icons.css',
})
export class DesktopIconsComponent {
  private readonly wm = inject(WindowManagerService);

  static readonly GRID_X = 90;
  static readonly GRID_Y = 90;
  private static readonly ICON_W = 80;
  private static readonly ICON_H = 100;

  readonly icons = signal<DesktopIcon[]>([
    { id: 'terminal', label: 'Terminal', windowType: 'terminal', icon: '🖥', x: 0, y: 0 },
    { id: 'about', label: 'About Me', windowType: 'about', icon: '👤', x: 0, y: 90 },
    { id: 'projects', label: 'Projects', windowType: 'projects', icon: '📁', x: 0, y: 180 },
    { id: 'skills', label: 'Skills', windowType: 'skills', icon: '⚡', x: 0, y: 270 },
    { id: 'contact', label: 'Contact', windowType: 'contact', icon: '✉', x: 0, y: 360 },
    { id: 'files', label: 'Files', windowType: 'file-manager', icon: '📂', x: 0, y: 450 },
  ]);

  readonly draggingId = signal<string | null>(null);
  readonly ghostTarget = signal<{ x: number; y: number } | null>(null);

  private dragState: { iconId: string; offsetX: number; offsetY: number; moved: boolean } | null = null;
  private lastTap: { iconId: string; time: number } | null = null;
  private static readonly DOUBLE_TAP_MS = 300;
  private static readonly LONG_PRESS_MS = 400;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingTouch: { icon: DesktopIcon; clientX: number; clientY: number } | null = null;

  openWindow(icon: DesktopIcon): void {
    this.wm.open(icon.windowType, icon.label);
  }

  onMouseDown(event: MouseEvent, icon: DesktopIcon): void {
    event.preventDefault();
    this.startDrag(icon, event.clientX, event.clientY);
  }

  onTouchStart(event: TouchEvent, icon: DesktopIcon): void {
    const touch = event.touches[0];

    // Double-tap detection
    const now = Date.now();
    if (this.lastTap && this.lastTap.iconId === icon.id && now - this.lastTap.time < DesktopIconsComponent.DOUBLE_TAP_MS) {
      this.clearLongPress();
      this.openWindow(icon);
      this.lastTap = null;
      return;
    }
    this.lastTap = { iconId: icon.id, time: now };

    // Start long-press timer for drag
    this.pendingTouch = { icon, clientX: touch.clientX, clientY: touch.clientY };
    this.longPressTimer = setTimeout(() => {
      if (this.pendingTouch) {
        this.startDrag(this.pendingTouch.icon, this.pendingTouch.clientX, this.pendingTouch.clientY);
        this.pendingTouch = null;
      }
    }, DesktopIconsComponent.LONG_PRESS_MS);
  }

  private clearLongPress(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.pendingTouch = null;
  }

  private startDrag(icon: DesktopIcon, clientX: number, clientY: number): void {
    this.dragState = {
      iconId: icon.id,
      offsetX: clientX - icon.x,
      offsetY: clientY - icon.y,
      moved: false,
    };
    this.draggingId.set(icon.id);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.dragState) return;
    this.moveDrag(event.clientX, event.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.dragState) {
      // Finger moved before long-press fired — cancel drag intent
      this.clearLongPress();
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    this.moveDrag(touch.clientX, touch.clientY);
  }

  private moveDrag(clientX: number, clientY: number): void {
    this.dragState!.moved = true;
    const maxX = window.innerWidth - DesktopIconsComponent.ICON_W;
    const maxY = window.innerHeight - DesktopIconsComponent.ICON_H;
    const newX = Math.max(0, Math.min(clientX - this.dragState!.offsetX, maxX));
    const newY = Math.max(0, Math.min(clientY - this.dragState!.offsetY, maxY));
    this.icons.update(icons =>
      icons.map(i => i.id === this.dragState!.iconId ? { ...i, x: newX, y: newY } : i)
    );
    const others = this.icons().filter(i => i.id !== this.dragState!.iconId);
    const target = this.snapToFreeSlot({ x: newX, y: newY }, others);
    this.ghostTarget.set(target);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onPointerUp(): void {
    this.clearLongPress();
    if (this.dragState?.moved) {
      const dragId = this.dragState.iconId;
      this.draggingId.set(null);
      this.ghostTarget.set(null);
      this.icons.update(icons => {
        const dragged = icons.find(i => i.id === dragId)!;
        const others = icons.filter(i => i.id !== dragId);
        const snapped = this.snapToFreeSlot(dragged, others);
        return icons.map(i => i.id === dragId ? { ...i, x: snapped.x, y: snapped.y } : i);
      });
    } else {
      this.draggingId.set(null);
      this.ghostTarget.set(null);
    }
    this.dragState = null;
  }

  onDblClick(icon: DesktopIcon): void {
    if (this.dragState?.moved) return;
    this.openWindow(icon);
  }

  private snapToFreeSlot(pos: { x: number; y: number }, others: DesktopIcon[]): { x: number; y: number } {
    const gx = DesktopIconsComponent.GRID_X;
    const gy = DesktopIconsComponent.GRID_Y;

    // Nearest grid-aligned position
    const snappedX = Math.round(pos.x / gx) * gx;
    const snappedY = Math.round(pos.y / gy) * gy;

    if (!this.isSlotTaken(snappedX, snappedY, others)) {
      return { x: snappedX, y: snappedY };
    }

    // Collect all grid slots sorted by distance from snap target
    const candidates: { x: number; y: number; dist: number }[] = [];
    const cols = Math.floor(window.innerWidth / gx);
    const rows = Math.floor(window.innerHeight / gy);
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cx = col * gx;
        const cy = row * gy;
        const dist = Math.hypot(cx - snappedX, cy - snappedY);
        candidates.push({ x: cx, y: cy, dist });
      }
    }
    candidates.sort((a, b) => a.dist - b.dist);

    for (const c of candidates) {
      if (!this.isSlotTaken(c.x, c.y, others)) {
        return { x: c.x, y: c.y };
      }
    }
    return { x: snappedX, y: snappedY };
  }

  /** Check if a grid slot is already occupied by another icon (exact grid match) */
  private isSlotTaken(x: number, y: number, others: DesktopIcon[]): boolean {
    return others.some(o => o.x === x && o.y === y);
  }
}
