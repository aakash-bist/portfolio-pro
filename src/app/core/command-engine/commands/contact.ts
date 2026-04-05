import { CommandFactory } from './command-factory';

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
      '│  📍 Location: Noida, India               │',
      '│  📞 Phone:    (+91) 9555747477           │',
      '│  ✉  Email:    aakashbist@outlook.com     │',
      '│  🔗 LinkedIn: linkedin.com/in/aakash-bist│',
      '│  💻 GitHub:   github.com/aakash-bist     │',
      '├──────────────────────────────────────────┤',
      '│  Open to opportunities!                  │',
      '│  Feel free to reach out.                 │',
      '└──────────────────────────────────────────┘',
    ].join('\n'),
  }),
});
