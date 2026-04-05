import { CommandFactory } from './command-factory';
import { SKILLS } from '../../../shared/data/portfolio.data';

const SKILLS_MAP: Record<string, { name: string; level: number }[]> = Object.fromEntries(
  SKILLS.map(cat => [cat.name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-'), cat.skills])
);

function skillBar(level: number): string {
  const filled = Math.round(level / 5);
  return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

export const createSkillsCommand: CommandFactory = () => ({
  name: 'skills',
  description: 'Display technical skills',
  usage: 'skills [--filter <category>]',
  execute: (ctx) => {
    const filter = ctx.flags['filter'];
    const categories = typeof filter === 'string'
      ? { [filter]: SKILLS_MAP[filter] }
      : SKILLS_MAP;

    if (typeof filter === 'string' && !SKILLS_MAP[filter]) {
      const valid = Object.keys(SKILLS_MAP).join(', ');
      return { output: `skills: unknown category '${filter}'\nAvailable: ${valid}`, isError: true };
    }

    const sections = Object.entries(categories).map(([cat, items]) => {
      const title = `  ── ${cat.toUpperCase()} ──`;
      const rows = items!.map(s =>
        `    ${s.name.padEnd(14)} ${skillBar(s.level)}  ${s.level}%`
      );
      return [title, ...rows].join('\n');
    });

    return {
      isError: false,
      output: [
        'Skills:', '',
        ...sections,
        '',
        'Use "skills --filter <category>" to filter',
        `Categories: ${Object.keys(SKILLS_MAP).join(', ')}`,
      ].join('\n'),
    };
  },
});
