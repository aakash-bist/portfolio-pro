import { Injectable } from '@angular/core';
import { FileSystemNode } from '../../shared/models';
import { ABOUT, CONTACT, EXPERIENCE, PROJECTS, SKILLS } from '../../shared/data/portfolio.data';

@Injectable({ providedIn: 'root' })
export class FileSystemService {
  private root: FileSystemNode;
  private cwd: FileSystemNode;

  constructor() {
    this.root = this.buildTree();
    this.cwd = this.resolve('/home/aakash')!;
  }

  pwd(): string {
    return this.getAbsolutePath(this.cwd);
  }

  ls(path?: string): string {
    const target = path ? this.resolve(path, this.cwd) : this.cwd;
    if (!target) {
      throw new Error(`ls: cannot access '${path}': No such file or directory`);
    }
    if (target.type === 'file') {
      return this.formatEntry(target);
    }
    if (!target.children || target.children.length === 0) {
      return '';
    }
    return target.children.map(c => this.formatEntry(c)).join('\n');
  }

  cd(path: string): string {
    if (!path || path === '~') {
      this.cwd = this.resolve('/home/aakash')!;
      return '';
    }
    if (path === '-') {
      // Simplified — just go home
      this.cwd = this.resolve('/home/aakash')!;
      return '';
    }

    const target = this.resolve(path, this.cwd);
    if (!target) {
      throw new Error(`cd: no such file or directory: ${path}`);
    }
    if (target.type !== 'directory') {
      throw new Error(`cd: not a directory: ${path}`);
    }
    this.cwd = target;
    return '';
  }

  cat(path: string): string {
    const target = this.resolve(path, this.cwd);
    if (!target) {
      throw new Error(`cat: ${path}: No such file or directory`);
    }
    if (target.type === 'directory') {
      throw new Error(`cat: ${path}: Is a directory`);
    }
    return target.content ?? '';
  }

  resolve(path: string, from?: FileSystemNode): FileSystemNode | null {
    let current: FileSystemNode | null;

    if (path.startsWith('/')) {
      current = this.root;
      path = path.slice(1);
    } else if (path.startsWith('~')) {
      current = this.resolve('/home/aakash');
      path = path.slice(1).replace(/^\//, '');
    } else {
      current = from ?? this.cwd;
    }

    if (!path) return current;

    const parts = path.split('/').filter(Boolean);

    for (const part of parts) {
      if (!current) return null;

      if (part === '.') continue;

      if (part === '..') {
        current = current.parent ?? current;
        continue;
      }

      if (current.type !== 'directory' || !current.children) return null;

      const child = current.children.find(c => c.name === part);
      if (!child) return null;
      current = child;
    }

    return current;
  }

  getCompletions(partial: string): string[] {
    if (!partial) {
      const dir = this.cwd;
      return dir.children?.map(c => c.name + (c.type === 'directory' ? '/' : '')) ?? [];
    }

    const lastSlash = partial.lastIndexOf('/');
    let dirPath: string;
    let prefix: string;

    if (lastSlash === -1) {
      dirPath = '';
      prefix = partial;
    } else {
      dirPath = partial.slice(0, lastSlash) || '/';
      prefix = partial.slice(lastSlash + 1);
    }

    const dir = dirPath ? this.resolve(dirPath, this.cwd) : this.cwd;
    if (!dir || dir.type !== 'directory' || !dir.children) return [];

    return dir.children
      .filter(c => c.name.startsWith(prefix))
      .map(c => {
        const base = lastSlash === -1 ? '' : partial.slice(0, lastSlash + 1);
        return base + c.name + (c.type === 'directory' ? '/' : '');
      });
  }

  private getAbsolutePath(node: FileSystemNode): string {
    const parts: string[] = [];
    let current: FileSystemNode | undefined = node;

    while (current && current !== this.root) {
      parts.unshift(current.name);
      current = current.parent;
    }

    return '/' + parts.join('/');
  }

  private formatEntry(node: FileSystemNode): string {
    const perms = node.permissions ?? (node.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--');
    const size = String(node.size ?? (node.type === 'directory' ? 4096 : (node.content?.length ?? 0))).padStart(6);
    const date = node.modified ?? 'Apr  5 2026';
    const name = node.type === 'directory' ? `${node.name}/` : node.name;
    return `${perms}  aakash  ${size}  ${date}  ${name}`;
  }

  private buildTree(): FileSystemNode {
    const aboutContent = [
      `Name:       ${ABOUT.name}`,
      `Role:       ${ABOUT.role}`,
      `Location:   ${ABOUT.location}`,
      `Education:  ${ABOUT.education}`,
      '',
      ABOUT.summary,
      '',
      `Awards: ${ABOUT.awards}`,
    ].join('\n');

    const resumeContent = [
      'WORK EXPERIENCE',
      '═══════════════',
      ...EXPERIENCE.flatMap(e => [
        `${e.title} | ${e.company}     ${e.period}`,
        ...e.highlights.map(h => `  - ${h}`),
        '',
      ]),
      'Run "projects" to see my work.',
      'Run "skills" to see my tech stack.',
    ].join('\n');

    const contactContent = CONTACT.map(c => `${c.icon} ${c.label}: ${c.value}`).join('\n');

    const skillBar = (level: number): string => {
      const filled = Math.round(level / 5);
      return '█'.repeat(filled) + '░'.repeat(20 - filled);
    };

    const currentProjects = PROJECTS.filter(p => p.status === 'In Development');
    const completedProjects = PROJECTS.filter(p => p.status !== 'In Development');

    const root = this.dir('/', [
      this.dir('home', [
        this.dir('aakash', [
          this.file('.bashrc', '# ~/.bashrc\nexport PS1="aakash@portfolio:~$ "\nalias ll="ls -la"'),
          this.file('about.txt', aboutContent),
          this.file('resume.txt', resumeContent),
          this.file('contact.txt', contactContent),
          this.dir('projects', [
            this.dir('current',
              currentProjects.map(p => this.file(
                `${p.name.toLowerCase().replace(/[_\s]+/g, '-')}.md`,
                `Project: ${p.name}\nTech:    ${p.tech}\nDesc:    ${p.desc}\nStatus:  ${p.status}`,
              ))
            ),
            this.dir('completed',
              completedProjects.map(p => this.file(
                `${p.name.toLowerCase().replace(/[_\s]+/g, '-')}.md`,
                `Project: ${p.name}\nTech:    ${p.tech}\nDesc:    ${p.desc}\nStatus:  ${p.status}`,
              ))
            ),
          ]),
          this.dir('skills',
            SKILLS.map(cat => this.file(
              `${cat.name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-')}.txt`,
              cat.skills.map(s => `${s.name.padEnd(17)}${skillBar(s.level)}  ${s.level}%`).join('\n'),
            ))
          ),
        ]),
      ]),
    ]);

    this.setParents(root);
    return root;
  }

  private dir(name: string, children: FileSystemNode[] = []): FileSystemNode {
    return {
      name,
      type: 'directory',
      children,
      permissions: 'drwxr-xr-x',
      size: 4096,
      modified: 'Apr  5 2026',
    };
  }

  private file(name: string, content: string): FileSystemNode {
    return {
      name,
      type: 'file',
      content,
      permissions: '-rw-r--r--',
      size: content.length,
      modified: 'Apr  5 2026',
    };
  }

  private setParents(node: FileSystemNode): void {
    if (node.children) {
      for (const child of node.children) {
        child.parent = node;
        this.setParents(child);
      }
    }
  }
}
