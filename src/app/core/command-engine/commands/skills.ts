import { CommandFactory } from './command-factory';

interface Skill {
  name: string;
  level: number;
}

const SKILLS_DATA: Record<string, Skill[]> = {
  frontend: [
    { name: 'Angular 2+', level: 95 },
    { name: 'React', level: 80 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'Bootstrap', level: 80 },
    { name: 'Angular Material', level: 85 },
  ],
  backend: [
    { name: 'Node.js', level: 90 },
    { name: 'NestJS', level: 80 },
    { name: 'Express.js', level: 85 },
  ],
  databases: [
    { name: 'MongoDB', level: 90 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 80 },
    { name: 'Redis', level: 75 },
    { name: 'Elasticsearch', level: 75 },
    { name: 'Amazon Redshift', level: 75 },
    { name: 'Snowflake', level: 70 },
  ],
  tools: [
    { name: 'Docker', level: 80 },
    { name: 'Git', level: 95 },
    { name: 'Firebase', level: 80 },
    { name: 'Vercel', level: 80 },
    { name: 'Cypress', level: 75 },
    { name: 'n8n', level: 70 },
  ],
};

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
      ? { [filter]: SKILLS_DATA[filter] }
      : SKILLS_DATA;

    if (typeof filter === 'string' && !SKILLS_DATA[filter]) {
      const valid = Object.keys(SKILLS_DATA).join(', ');
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
        `Categories: ${Object.keys(SKILLS_DATA).join(', ')}`,
      ].join('\n'),
    };
  },
});
