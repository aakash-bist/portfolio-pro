import { Injectable } from '@angular/core';
import { FileSystemNode } from '../../shared/models';

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
    const name = node.type === 'directory' ? `\x1b[1;34m${node.name}/\x1b[0m` : node.name;
    return `${perms}  aakash  ${size}  ${date}  ${name}`;
  }

  private buildTree(): FileSystemNode {
    const root = this.dir('/', [
      this.dir('home', [
        this.dir('aakash', [
          this.file('.bashrc', '# ~/.bashrc\nexport PS1="aakash@portfolio:~$ "\nalias ll="ls -la"', 86),
          this.file('about.txt',
            'Name:       Aakash Bist\n' +
            'Role:       Full Stack Developer | 5+ Years Exp\n' +
            'Location:   Noida, India\n' +
            'Education:  B.Tech CSE — MDU Rohtak (GPA: 8.1)\n' +
            '\n' +
            'Full Stack Developer with 5+ years of experience\n' +
            'building scalable web applications using MEAN and\n' +
            'MERN stacks. Skilled in cloud platforms, database\n' +
            'management, and leading cross-functional teams.\n' +
            '\n' +
            'Awards: Smart India Hackathon Winner (2019 & 2020)',
            320),
          this.file('resume.txt',
            'WORK EXPERIENCE\n' +
            '═══════════════\n' +
            'Sr. Software Developer | SupplyCopia     May 2025 - Present\n' +
            '  - Transitioned from Algoscale for high-impact delivery\n' +
            '  - Integrated Snowflake for 60% faster query response\n' +
            '  - Improved data pipelines and cloud integrations\n' +
            '\n' +
            'Team Lead (MEAN Stack) | Algoscale       Aug 2021 - Apr 2025\n' +
            '  - Led team of 5, integrated 150+ European hospitals\n' +
            '  - 30% faster response, 20% improved stability\n' +
            '  - Expanded service reach to 1400+ hospitals\n' +
            '\n' +
            'MEAN Stack Developer | E-Tech Services   Jan 2020 - Aug 2021\n' +
            '  - Optimized APIs, 30% faster data retrieval\n' +
            '  - Implemented agile, 20% delivery efficiency gain\n' +
            '\n' +
            'Frontend Developer | Planify (Intern)    Aug 2019 - Nov 2019\n' +
            '  - Built interactive UIs with design team\n' +
            '\n' +
            'Run "projects" to see my work.\n' +
            'Run "skills" to see my tech stack.',
            680),
        ]),
      ]),
      this.dir('projects', [
        this.dir('current', [
          this.file('aakash-os.md',
            'Project: AAKASH_OS\n' +
            'Tech:    Angular, TypeScript, Tailwind\n' +
            'Desc:    Terminal-based portfolio OS\n' +
            'Status:  In Development',
            120),
        ]),
        this.dir('completed', [
          this.file('sc-analytics.md',
            'Project: SC Analytics\n' +
            'Tech:    Angular, Express.js, Redis, MySQL, MongoDB, Redshift, Elasticsearch\n' +
            'Desc:    Data querying system with interactive visualizations\n' +
            'Status:  Completed',
            180),
          this.file('mr-reporting.md',
            'Project: MR Reporting\n' +
            'Tech:    Angular, Loopback 3, MongoDB\n' +
            'Desc:    B2B SaaS platform for 2000+ clients\n' +
            'Status:  Completed',
            130),
          this.file('dhaam-organics.md',
            'Project: Dhaam Organics\n' +
            'Tech:    React, Node.js, MongoDB, Cloudinary, Material UI\n' +
            'Desc:    E-commerce farm-to-table application\n' +
            'Status:  Completed',
            140),
          this.file('stet-sikkim.md',
            'Project: STET Sikkim Govt.\n' +
            'Tech:    Angular, Node.js, MongoDB\n' +
            'Desc:    Record management system — SIH Winner\n' +
            'Status:  Completed',
            125),
        ]),
      ]),
      this.dir('skills', [
        this.file('frontend.txt',
          'Angular 2+       ████████████████████  95%\n' +
          'React            ████████████████      80%\n' +
          'Tailwind CSS     █████████████████     85%\n' +
          'Bootstrap        ████████████████      80%\n' +
          'Angular Material █████████████████     85%',
          250),
        this.file('backend.txt',
          'Node.js          ███████████████████   90%\n' +
          'NestJS           ████████████████      80%\n' +
          'Express.js       █████████████████     85%',
          150),
        this.file('databases.txt',
          'MongoDB          ███████████████████   90%\n' +
          'PostgreSQL       ████████████████      80%\n' +
          'MySQL            ████████████████      80%\n' +
          'Redis            ███████████████       75%\n' +
          'Elasticsearch    ███████████████       75%\n' +
          'Amazon Redshift  ███████████████       75%\n' +
          'Snowflake        ██████████████        70%',
          350),
        this.file('tools.txt',
          'Docker           ████████████████      80%\n' +
          'Git              ████████████████████  95%\n' +
          'Firebase         ████████████████      80%\n' +
          'Vercel           ████████████████      80%\n' +
          'Cypress          ███████████████       75%\n' +
          'n8n              ██████████████        70%',
          300),
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

  private file(name: string, content: string, size?: number): FileSystemNode {
    return {
      name,
      type: 'file',
      content,
      permissions: '-rw-r--r--',
      size: size ?? content.length,
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
