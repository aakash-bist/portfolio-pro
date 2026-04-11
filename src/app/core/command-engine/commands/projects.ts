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
          `│ Desc:   ${project.desc}`,
          `│ URL:    ${project.url}`,
          `└${'─'.repeat(30)}`,
        ].join('\n'),
      };
    }

    const header = `  ${'ID'.padEnd(4)} ${'Name'.padEnd(14)} ${'Tech'}`;
    const sep = '  ' + '─'.repeat(60);
    const rows = PROJECTS.map(p =>
      `  ${String(p.id).padEnd(4)} ${p.name.padEnd(14)} ${p.tech}`
    );

    // Use compact card layout for narrow viewports
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

    if (isMobile) {
      const cards = PROJECTS.map(p => [
        `  [${p.id}] ${p.name}`,
        `      ${p.tech}`,
      ].join('\n'));

      return {
        isError: false,
        output: ['Projects:', '', ...cards, '', 'Use "projects --open <id>" for details'].join('\n'),
      };
    }

    return {
      isError: false,
      output: ['Projects:', sep, header, sep, ...rows, sep, '', 'Use "projects --open <id>" for details'].join('\n'),
    };
  },
});
