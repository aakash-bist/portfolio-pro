import { CommandFactory } from './command-factory';
import { PROJECTS } from '../../../shared/data/portfolio.data';

export const createProjectsCommand: CommandFactory = () => ({
  name: 'projects',
  description: 'List portfolio projects',
  usage: 'projects [--open <id>]',
  execute: (ctx) => {
    const openId = ctx.flags['open'];

    if (openId !== undefined) {
      const id = typeof openId === 'string' ? parseInt(openId, 10) : NaN;
      const project = PROJECTS.find(p => p.id === id);
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
    const rows = PROJECTS.map(p =>
      `  ${String(p.id).padEnd(4)} ${p.name.padEnd(14)} ${p.tech.padEnd(32)} ${p.status}`
    );

    return {
      isError: false,
      output: ['Projects:', sep, header, sep, ...rows, sep, '', 'Use "projects --open <id>" for details'].join('\n'),
    };
  },
});
