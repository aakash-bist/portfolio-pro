import { Component, inject, signal, computed, input, OnInit } from '@angular/core';
import { FileSystemService } from '../../core/filesystem/filesystem.service';
import { FileSystemNode } from '../../shared/models';
import { WinAboutComponent } from './win-about';
import { WinProjectsComponent } from './win-projects';
import { WinSkillsComponent } from './win-skills';
import { WinContactComponent } from './win-contact';
import { WinExperienceComponent } from './win-experience';

type Section = 'home' | 'about' | 'projects' | 'skills' | 'contact' | 'experience';

interface NavItem {
  id: Section;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-win-file-manager',
  standalone: true,
  imports: [WinAboutComponent, WinProjectsComponent, WinSkillsComponent, WinContactComponent, WinExperienceComponent],
  template: `
    <div class="file-manager">
      <!-- Toolbar -->
      <div class="fm-toolbar">
        <div class="fm-nav">
          <button class="nav-btn" [disabled]="activeSection() !== 'home' || historyIndex() <= 0" (click)="goBack()">◂</button>
          <button class="nav-btn" [disabled]="activeSection() !== 'home' || historyIndex() >= history().length - 1" (click)="goForward()">▸</button>
        </div>
        <div class="fm-path-bar">
          <span class="path-home-icon">🏠</span>
          @if (activeSection() === 'home') {
            @for (seg of pathSegments(); track $index) {
              @if ($index > 0) {
                <span class="path-sep">›</span>
              }
              <button class="path-segment" (click)="navigateToSegment($index)">{{ seg.label }}</button>
            }
          } @else {
            <span class="path-sep">›</span>
            <span class="path-segment-label">{{ sectionTitle() }}</span>
          }
        </div>
        <div class="fm-actions">
          <button class="action-btn">⋮</button>
          <button class="action-btn">🔍</button>
          @if (activeSection() === 'home') {
            <button class="action-btn view-btn" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">☷</button>
            <button class="action-btn view-btn" [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">☰</button>
          }
        </div>
      </div>

      <div class="fm-body">
        <!-- Sidebar -->
        <nav class="fm-sidebar">
          @for (item of sidebarItems; track item.id) {
            <button class="sidebar-item"
                    [class.active]="activeSection() === item.id"
                    (click)="activeSection.set(item.id)">
              <span class="si-icon">{{ item.icon }}</span>
              <span class="si-label">{{ item.label }}</span>
            </button>
          }
        </nav>

        <!-- Main content -->
        <main class="fm-content">
          @switch (activeSection()) {
            @case ('home') {
              @if (viewingFile()) {
                <div class="file-viewer">
                  <div class="fv-header">
                    <button class="fv-back" (click)="viewingFile.set(null)">‹ Back</button>
                    <span class="fv-name">{{ viewingFile()!.name }}</span>
                  </div>
                  <pre class="fv-content">{{ viewingFile()!.content }}</pre>
                </div>
              } @else {
                <div class="content-grid" [class.list-mode]="viewMode() === 'list'">
                  @for (item of currentItems(); track item.name) {
                    <div class="grid-item" (dblclick)="onItemDblClick(item)" [title]="item.name">
                      <div class="item-icon-wrap">
                        @if (item.type === 'directory') {
                          <div class="folder-shape"></div>
                        } @else {
                          <div class="file-shape">
                            <span class="file-ext-label">{{ getExtension(item.name) }}</span>
                          </div>
                        }
                      </div>
                      <span class="item-name">{{ truncateName(item.name) }}</span>
                    </div>
                  }
                  @if (currentItems().length === 0) {
                    <div class="empty-state">
                      <span class="empty-icon">📂</span>
                      <p>Folder is empty</p>
                    </div>
                  }
                </div>
              }
            }
            @case ('about') {
              <app-win-about />
            }
            @case ('projects') {
              <app-win-projects />
            }
            @case ('skills') {
              <app-win-skills />
            }
            @case ('contact') {
              <app-win-contact />
            }
            @case ('experience') {
              <app-win-experience />
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 100%; }

    .file-manager {
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: -apple-system, 'Segoe UI', 'Ubuntu', sans-serif;
      color: #ddd;
    }

    /* ── Toolbar ── */
    .fm-toolbar {
      display: flex;
      align-items: center;
      height: 42px;
      background: #303030;
      border-bottom: 1px solid #1a1a1a;
      padding: 0 8px;
      gap: 8px;
      flex-shrink: 0;
    }
    .fm-nav { display: flex; gap: 2px; }
    .nav-btn {
      background: transparent;
      border: none;
      color: #ccc;
      font-size: 18px;
      width: 30px;
      height: 30px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-btn:hover:not(:disabled) { background: #454545; }
    .nav-btn:disabled { color: #555; cursor: default; }

    .fm-path-bar {
      flex: 1;
      display: flex;
      align-items: center;
      background: #252525;
      border-radius: 8px;
      padding: 0 12px;
      height: 30px;
      gap: 4px;
      overflow: hidden;
    }
    .path-home-icon { font-size: 14px; }
    .path-sep { color: #666; font-size: 12px; }
    .path-segment {
      background: none;
      border: none;
      color: #ccc;
      font-size: 13px;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .path-segment:hover { background: #454545; }

    .fm-actions { display: flex; gap: 2px; }
    .action-btn {
      background: transparent;
      border: none;
      color: #999;
      font-size: 14px;
      width: 30px;
      height: 30px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .action-btn:hover { background: #454545; color: #ccc; }
    .view-btn.active { color: #fff; background: #454545; }

    /* ── Body ── */
    .fm-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .fm-sidebar {
      width: 200px;
      background: #2b2b2b;
      border-right: 1px solid #222;
      overflow-y: auto;
      padding: 6px 0;
      flex-shrink: 0;
    }
    .sidebar-section { padding: 2px 0; }
    .sidebar-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 7px 14px;
      gap: 10px;
      background: none;
      border: none;
      color: #ccc;
      font-size: 13px;
      cursor: pointer;
      text-align: left;
      border-radius: 0;
    }
    .sidebar-item:hover { background: #383838; }
    .sidebar-item.active {
      background: #404040;
      color: #fff;
    }
    .sidebar-item:disabled { color: #666; cursor: default; }
    .sidebar-item:disabled:hover { background: none; }
    .si-icon { font-size: 16px; width: 22px; text-align: center; flex-shrink: 0; }
    .si-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sidebar-divider {
      height: 1px;
      background: #3a3a3a;
      margin: 6px 14px;
    }
    .path-segment-label {
      color: #ccc;
      font-size: 13px;
      white-space: nowrap;
    }

    /* ── Content ── */
    .fm-content {
      flex: 1;
      overflow: auto;
      background: #1e1e1e;
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 4px;
      padding: 16px;
    }
    .content-grid.list-mode {
      grid-template-columns: 1fr;
    }
    .content-grid.list-mode .grid-item {
      flex-direction: row;
      padding: 6px 12px;
      border-radius: 4px;
      gap: 12px;
    }
    .content-grid.list-mode .item-icon-wrap {
      width: 32px;
      height: 28px;
      margin-bottom: 0;
    }
    .content-grid.list-mode .folder-shape {
      width: 28px;
      height: 22px;
    }
    .content-grid.list-mode .folder-shape::before {
      width: 12px;
      height: 5px;
      top: -5px;
      border-radius: 3px 3px 0 0;
    }
    .content-grid.list-mode .file-shape {
      width: 22px;
      height: 28px;
    }
    .content-grid.list-mode .file-ext-label { font-size: 7px; }
    .content-grid.list-mode .item-name {
      max-width: none;
      text-align: left;
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 14px 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
    }
    .grid-item:hover { background: rgba(255, 255, 255, 0.06); }
    .item-icon-wrap {
      width: 64px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    /* Folder icon — Ubuntu-style orange */
    .folder-shape {
      width: 56px;
      height: 42px;
      background: linear-gradient(180deg, #d4a276 0%, #b88650 100%);
      border-radius: 0 6px 6px 6px;
      position: relative;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    }
    .folder-shape::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 0;
      width: 22px;
      height: 8px;
      background: #d4a276;
      border-radius: 5px 5px 0 0;
    }

    /* File icon */
    .file-shape {
      width: 42px;
      height: 52px;
      background: linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%);
      border-radius: 3px;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    }
    .file-shape::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 12px 12px 0;
      border-color: transparent #1e1e1e transparent transparent;
    }
    .file-ext-label {
      font-size: 9px;
      font-weight: 700;
      color: #777;
      text-transform: uppercase;
    }

    .item-name {
      font-size: 12px;
      color: #ddd;
      text-align: center;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.4;
    }

    /* ── File viewer ── */
    .file-viewer {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .fv-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      background: #262626;
      border-bottom: 1px solid #1a1a1a;
    }
    .fv-back {
      background: none;
      border: none;
      color: #60a5fa;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .fv-back:hover { background: #333; }
    .fv-name { color: #ddd; font-size: 13px; font-weight: 500; }
    .fv-content {
      flex: 1;
      padding: 16px 20px;
      margin: 0;
      color: #ccc;
      font-size: 13px;
      font-family: 'Fira Code', 'Consolas', monospace;
      line-height: 1.7;
      overflow: auto;
      white-space: pre-wrap;
    }

    /* ── Empty state ── */
    .empty-state {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      color: #666;
    }
    .empty-icon { font-size: 48px; margin-bottom: 12px; }
    .empty-state p { margin: 0; font-size: 14px; }

    /* ── Mobile ── */
    @media (max-width: 600px) {
      .fm-sidebar { width: 0; display: none; }
      .content-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        padding: 10px;
      }
      .folder-shape { width: 44px; height: 34px; }
      .folder-shape::before { width: 16px; height: 6px; top: -6px; }
      .file-shape { width: 34px; height: 42px; }
    }
  `,
})
export class WinFileManagerComponent implements OnInit {
  private readonly fs = inject(FileSystemService);

  readonly section = input<string>('file-manager');
  readonly activeSection = signal<Section>('home');
  readonly currentPath = signal('/home/aakash');
  readonly history = signal<string[]>(['/home/aakash']);
  readonly historyIndex = signal(0);
  readonly viewingFile = signal<FileSystemNode | null>(null);
  readonly viewMode = signal<'grid' | 'list'>('grid');

  readonly sidebarItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About Me', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'contact', label: 'Contact', icon: '✉' },
    { id: 'experience', label: 'Experience', icon: '💼' },
  ];

  private static readonly SECTION_MAP: Record<string, Section> = {
    'file-manager': 'home',
    'about': 'about',
    'projects': 'projects',
    'skills': 'skills',
    'contact': 'contact',
    'experience': 'experience',
  };

  readonly sectionTitle = computed(() => {
    const titles: Record<Section, string> = {
      home: 'Home',
      about: 'About Me',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      experience: 'Experience',
    };
    return titles[this.activeSection()];
  });

  readonly currentItems = computed(() => {
    const node = this.fs.resolve(this.currentPath());
    if (!node || node.type !== 'directory' || !node.children) return [];
    return [...node.children].sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  });

  readonly pathSegments = computed(() => {
    const path = this.currentPath();
    const homePath = '/home/aakash';
    if (path === homePath || path === homePath + '/') {
      return [{ label: 'Home', path: homePath }];
    }
    const relative = path.startsWith(homePath + '/') ? path.slice(homePath.length + 1) : path;
    const parts = relative.split('/').filter(Boolean);
    const segments = [{ label: 'Home', path: homePath }];
    let accum = homePath;
    for (const part of parts) {
      accum += '/' + part;
      segments.push({ label: part, path: accum });
    }
    return segments;
  });

  ngOnInit(): void {
    this.activeSection.set(
      WinFileManagerComponent.SECTION_MAP[this.section()] ?? 'home'
    );
  }

  onItemDblClick(item: FileSystemNode): void {
    if (item.type === 'directory') {
      this.navigateTo(this.currentPath() + '/' + item.name);
    } else {
      this.viewingFile.set(item);
    }
  }

  navigateTo(path: string): void {
    this.viewingFile.set(null);
    const idx = this.historyIndex();
    const newHistory = [...this.history().slice(0, idx + 1), path];
    this.history.set(newHistory);
    this.historyIndex.set(newHistory.length - 1);
    this.currentPath.set(path);
  }

  navigateToSegment(index: number): void {
    const seg = this.pathSegments()[index];
    if (seg) this.navigateTo(seg.path);
  }

  goBack(): void {
    const idx = this.historyIndex();
    if (idx > 0) {
      this.historyIndex.set(idx - 1);
      this.currentPath.set(this.history()[idx - 1]);
      this.viewingFile.set(null);
    }
  }

  goForward(): void {
    const idx = this.historyIndex();
    if (idx < this.history().length - 1) {
      this.historyIndex.set(idx + 1);
      this.currentPath.set(this.history()[idx + 1]);
      this.viewingFile.set(null);
    }
  }

  getExtension(name: string): string {
    const dot = name.lastIndexOf('.');
    if (dot <= 0) return '';
    return name.slice(dot + 1);
  }

  truncateName(name: string): string {
    return name.length > 18 ? name.slice(0, 15) + '...' : name;
  }
}
