import { CommandFactory } from './command-factory';

interface Project {
  id: number;
  name: string;
  tech: string;
  status: string;
  desc: string;
  url: string;
}

const PROJECT_LIST: Project[] = [
  { id: 1, name: 'SC Analytics', tech: 'Angular, Express.js, Redis, MySQL, MongoDB, Redshift, Elasticsearch', status: 'Completed', desc: 'Powerful data querying system using Amazon Redshift with interactive filters, widgets, and dynamic visualizations', url: '' },
  { id: 2, name: 'MR Reporting', tech: 'Angular, Loopback 3, MongoDB', status: 'Completed', desc: 'B2B SaaS platform used by 2000+ clients for field activity management, boosting efficiency by 40%', url: '' },
  { id: 3, name: 'Dhaam Organics', tech: 'React, Node.js, MongoDB, Cloudinary, Material UI', status: 'Completed', desc: 'Complete e-commerce application streamlining the farm-to-table experience', url: '' },
  { id: 4, name: 'STET Sikkim', tech: 'Angular, Node.js, MongoDB', status: 'Completed', desc: 'Record management system for Sikkim Govt — Smart India Hackathon winning solution', url: '' },
  { id: 5, name: 'AAKASH_OS', tech: 'Angular, TypeScript, Tailwind', status: 'In Development', desc: 'Terminal-based portfolio OS simulating a Linux desktop environment', url: 'https://github.com/aakash-bist/aakash-os' },
];

export const createProjectsCommand: CommandFactory = () => ({
  name: 'projects',
  description: 'List portfolio projects',
  usage: 'projects [--open <id>]',
  execute: (ctx) => {
    const openId = ctx.flags['open'];

    if (openId !== undefined) {
      const id = typeof openId === 'string' ? parseInt(openId, 10) : NaN;
      const project = PROJECT_LIST.find(p => p.id === id);
      if (!project) {
        return { output: `projects: no project with id ${openId}`, isError: true };
      }
      return {
        isError: false,
        output: [
          `┌─── ${project.name} ───`,
          `│ ID:     ${project.id}`,
          `│ Tech:   ${project.tech}`,
          `│ Status: ${project.status}`,
          `│ Desc:   ${project.desc}`,
          `│ URL:    ${project.url}`,
          `└${'─'.repeat(30)}`,
        ].join('\n'),
      };
    }

    const header = `  ${'ID'.padEnd(4)} ${'Name'.padEnd(14)} ${'Tech'.padEnd(32)} ${'Status'}`;
    const sep = '  ' + '─'.repeat(70);
    const rows = PROJECT_LIST.map(p =>
      `  ${String(p.id).padEnd(4)} ${p.name.padEnd(14)} ${p.tech.padEnd(32)} ${p.status}`
    );

    return {
      isError: false,
      output: ['Projects:', sep, header, sep, ...rows, sep, '', 'Use "projects --open <id>" for details'].join('\n'),
    };
  },
});
