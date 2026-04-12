import { CommandFactory } from './command-factory';
import { EXPERIENCE, computeDuration } from '../../../shared/data/portfolio.data';

export const createExperienceCommand: CommandFactory = () => ({
  name: 'experience',
  description: 'Display work experience',
  usage: 'experience [--company <name>]',
  execute: (ctx) => {
    const filter = ctx.flags['company'];

    if (typeof filter === 'string') {
      const match = EXPERIENCE.find(e =>
        e.company.toLowerCase().includes(filter.toLowerCase())
      );
      if (!match) {
        const valid = EXPERIENCE.map(e => e.company).join(', ');
        return { output: `experience: no match for '${filter}'\nCompanies: ${valid}`, isError: true };
      }
      return {
        isError: false,
        output: [
          `┌─── ${match.company} ───`,
          `│ Title:   ${match.title}`,
          `│ Period:  ${match.period} (${computeDuration(match.period)})`,
          `│`,
          ...match.highlights.map(h => `│  • ${h}`),
          `└${'─'.repeat(30)}`,
        ].join('\n'),
      };
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

    const timeline = EXPERIENCE.flatMap((e, i) => {
      const isLast = i === EXPERIENCE.length - 1;
      const duration = computeDuration(e.period);
      const connector = isLast ? '╰' : '├';
      const pipe = isLast ? ' ' : '│';

      if (isMobile) {
        return [
          `${connector}─● ${e.title}`,
          `${pipe}  ${e.company}`,
          `${pipe}  ${e.period} (${duration})`,
          ...e.highlights.map(h => `${pipe}  ◦ ${h}`),
          `${pipe}`,
        ];
      }

      return [
        `  ${connector}──● ${e.title}`,
        `  ${pipe}     ${e.company} │ ${e.period} (${duration})`,
        ...e.highlights.map(h => `  ${pipe}     ◦ ${h}`),
        `  ${pipe}`,
      ];
    });

    const header = isMobile
      ? ['', '╭─ Work Experience ─╮', '│   Timeline        │', '╰──────────────────╯', '']
      : ['', '  ╭─── Work Experience ───────────────────────────╮', '  │                                               │', '  │   Timeline                                    │', '  ╰───────────────────────────────────────────────╯', ''];

    return {
      isError: false,
      output: [
        ...header,
        ...timeline,
        '',
        isMobile
          ? 'experience --company <name>'
          : '  Use "experience --company <name>" to filter',
      ].join('\n'),
    };
  },
});
