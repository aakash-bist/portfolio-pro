import { CommandFactory } from './command-factory';
import { ABOUT } from '../../../shared/data/portfolio.data';

export const createAboutCommand: CommandFactory = () => ({
  name: 'about',
  description: 'About me',
  usage: 'about',
  execute: () => ({
    isError: false,
    output: [
      '╔════════════════════════════════════════════════════════╗',
      `║             ${ABOUT.name.toUpperCase()} — About Me                    ║`,
      '╠════════════════════════════════════════════════════════╣',
      `║  Name:       ${ABOUT.name.padEnd(42)}║`,
      `║  Role:       ${ABOUT.role.padEnd(42)}║`,
      `║  Location:   ${ABOUT.location.padEnd(42)}║`,
      `║  Education:  ${ABOUT.education.padEnd(42)}║`,
      '╠════════════════════════════════════════════════════════╣',
      '║                                                        ║',
      ...ABOUT.summary.match(/.{1,52}/g)!.map(l => `║  ${l.padEnd(54)}║`),
      '║                                                        ║',
      '╠════════════════════════════════════════════════════════╣',
      `║  🏆 ${ABOUT.awards.padEnd(51)}║`,
      '╠════════════════════════════════════════════════════════╣',
      '║  Run "skills" to see my tech stack                     ║',
      '║  Run "projects" to see my work                         ║',
      '║  Run "contact" to reach me                             ║',
      '╚════════════════════════════════════════════════════════╝',
    ].join('\n'),
  }),
});
