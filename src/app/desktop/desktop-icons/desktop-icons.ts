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

  readonly icons = signal<DesktopIcon[]>([
    { id: 'terminal', label: 'Terminal', windowType: 'terminal', icon: '🖥', x: 20, y: 10 },
    { id: 'about', label: 'About Me', windowType: 'about', icon: '👤', x: 20, y: 95 },
    { id: 'projects', label: 'Projects', windowType: 'projects', icon: '📁', x: 20, y: 180 },
    { id: 'skills', label: 'Skills', windowType: 'skills', icon: '⚡', x: 20, y: 265 },
    { id: 'contact', label: 'Contact', windowType: 'contact', icon: '✉', x: 20, y: 350 },
  ]);

  private static readonly ICON_W = 80;
  private static readonly ICON_H = 100;
  private static readonly GRID_X = 90;
  private static readonly GRID_Y = 85;

  private dragState: { iconId: string; offsetX: number; offsetY: number; moved: boolean } | null = null;

  openWindow(icon: DesktopIcon): void {
    this.wm.open(icon.windowType, icon.label);
  }

  onMouseDown(event: MouseEvent, icon: DesktopIcon): void {
    event.preventDefault();
    this.dragState = {
      iconId: icon.id,
      offsetX: event.clientX - icon.x,
      offsetY: event.clientY - icon.y,
      moved: false,
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.dragState) return;
    this.dragState.moved = true;
    const maxX = window.innerWidth - DesktopIconsComponent.ICON_W;
    const maxY = window.innerHeight - DesktopIconsComponent.ICON_H;
    const newX = Math.max(0, Math.min(event.clientX - this.dragState.offsetX, maxX));
    const newY = Math.max(0, Math.min(event.clientY - this.dragState.offsetY, maxY));
    this.icons.update(icons =>
      icons.map(i => i.id === this.dragState!.iconId ? { ...i, x: newX, y: newY } : i)
    );
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.dragState?.moved) {
      const dragId = this.dragState.iconId;
      this.icons.update(icons => {
        const dragged = icons.find(i => i.id === dragId)!;
        const others = icons.filter(i => i.id !== dragId);
        const snapped = this.snapToFreeSlot(dragged, others);
        return icons.map(i => i.id === dragId ? { ...i, x: snapped.x, y: snapped.y } : i);
      });
    }
    this.dragState = null;
  }

  onDblClick(icon: DesktopIcon): void {
    if (this.dragState?.moved) return;
    this.openWindow(icon);
  }

  private snapToFreeSlot(icon: DesktopIcon, others: DesktopIcon[]): { x: number; y: number } {
    const gx = DesktopIconsComponent.GRID_X;
    const gy = DesktopIconsComponent.GRID_Y;
    const snappedX = Math.round(icon.x / gx) * gx;
    const snappedY = Math.round(icon.y / gy) * gy;

    if (!this.isOccupied(snappedX, snappedY, others)) {
      return { x: snappedX, y: snappedY };
    }

    // Find nearest free slot
    for (let r = 1; r < 20; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const cx = snappedX + dx * gx;
          const cy = snappedY + dy * gy;
          if (cx < 0 || cy < 0) continue;
          if (cx > window.innerWidth - DesktopIconsComponent.ICON_W) continue;
          if (cy > window.innerHeight - DesktopIconsComponent.ICON_H) continue;
          if (!this.isOccupied(cx, cy, others)) {
            return { x: cx, y: cy };
          }
        }
      }
    }
    return { x: snappedX, y: snappedY };
  }

  private isOccupied(x: number, y: number, others: DesktopIcon[]): boolean {
    const gx = DesktopIconsComponent.GRID_X;
    const gy = DesktopIconsComponent.GRID_Y;
    return others.some(o => Math.abs(o.x - x) < gx && Math.abs(o.y - y) < gy);
  }
}
