export interface WindowState {
  id: string;
  title: string;
  type: WindowType;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  zIndex: number;
}

export type WindowType = 'terminal' | 'about' | 'projects' | 'skills' | 'contact' | 'file-viewer';

export interface DesktopIcon {
  id: string;
  label: string;
  windowType: WindowType;
  icon: string;
  x: number;
  y: number;
}
