import { CommandFactory } from './command-factory';
import { CONTACT } from '../../../shared/data/portfolio.data';

export const createContactCommand: CommandFactory = () => ({
  name: 'contact',
  description: 'Display contact information',
  usage: 'contact',
  execute: () => ({
    isError: false,
    output: [
      '┌──────────────────────────────────────────┐',
      '│             Contact Me                   │',
      '├──────────────────────────────────────────┤',
      ...CONTACT.map(c => `│  ${c.icon} ${c.label.padEnd(10)} ${c.value.padEnd(25)}│`),
      '├──────────────────────────────────────────┤',
      '│  Open to opportunities!                  │',
      '│  Feel free to reach out.                 │',
      '└──────────────────────────────────────────┘',
    ].join('\n'),
  }),
});
