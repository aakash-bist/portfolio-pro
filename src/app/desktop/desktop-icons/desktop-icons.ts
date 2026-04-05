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
    { id: 'terminal', label: 'Terminal', windowType: 'terminal', icon: '🖥', x: 20, y: 20 },
    { id: 'about', label: 'About Me', windowType: 'about', icon: '👤', x: 20, y: 120 },
    { id: 'projects', label: 'Projects', windowType: 'projects', icon: '📁', x: 20, y: 220 },
    { id: 'skills', label: 'Skills', windowType: 'skills', icon: '⚡', x: 20, y: 320 },
    { id: 'contact', label: 'Contact', windowType: 'contact', icon: '✉', x: 20, y: 420 },
  ]);

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
    const newX = event.clientX - this.dragState.offsetX;
    const newY = event.clientY - this.dragState.offsetY;
    this.icons.update(icons =>
      icons.map(i => i.id === this.dragState!.iconId ? { ...i, x: newX, y: newY } : i)
    );
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.dragState = null;
  }

  onDblClick(icon: DesktopIcon): void {
    if (this.dragState?.moved) return;
    this.openWindow(icon);
  }
}
