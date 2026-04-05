import { Component, input, output, ElementRef, ViewChild, OnInit } from '@angular/core';
import { WindowState } from '../../shared/models';

@Component({
  selector: 'app-window',
  standalone: true,
  templateUrl: './window.html',
  styleUrl: './window.css',
})
export class WindowComponent implements OnInit {
  state = input.required<WindowState>();

  closed = output<string>();
  focused = output<string>();
  minimized = output<string>();
  maximized = output<string>();
  moved = output<{ id: string; x: number; y: number }>();
  resized = output<{ id: string; width: number; height: number }>();

  @ViewChild('windowEl') windowEl!: ElementRef<HTMLDivElement>;

  private dragging = false;
  private resizing = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartW = 0;
  private resizeStartH = 0;

  private boundMouseMove = this.onMouseMove.bind(this);
  private boundMouseUp = this.onMouseUp.bind(this);

  ngOnInit(): void {
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  onTitleBarMouseDown(event: MouseEvent): void {
    if (this.state().maximized) return;
    this.dragging = true;
    this.dragOffsetX = event.clientX - this.state().x;
    this.dragOffsetY = event.clientY - this.state().y;
    this.focused.emit(this.state().id);
    event.preventDefault();
  }

  onResizeMouseDown(event: MouseEvent): void {
    if (this.state().maximized) return;
    this.resizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeStartW = this.state().width;
    this.resizeStartH = this.state().height;
    event.preventDefault();
    event.stopPropagation();
  }

  onWindowClick(): void {
    this.focused.emit(this.state().id);
  }

  onClose(): void {
    this.closed.emit(this.state().id);
  }

  onMinimize(): void {
    this.minimized.emit(this.state().id);
  }

  onMaximize(): void {
    this.maximized.emit(this.state().id);
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      const x = Math.max(0, event.clientX - this.dragOffsetX);
      const y = Math.max(0, event.clientY - this.dragOffsetY);
      this.moved.emit({ id: this.state().id, x, y });
    }
    if (this.resizing) {
      const dx = event.clientX - this.resizeStartX;
      const dy = event.clientY - this.resizeStartY;
      this.resized.emit({
        id: this.state().id,
        width: this.resizeStartW + dx,
        height: this.resizeStartH + dy,
      });
    }
  }

  private onMouseUp(): void {
    this.dragging = false;
    this.resizing = false;
  }
}
