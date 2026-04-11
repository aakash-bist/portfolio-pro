import { CommandFactory } from './command-factory';
import { ABOUT } from '../../../shared/data/portfolio.data';

export const createAboutCommand: CommandFactory = () => ({
  name: 'about',
  description: 'About me',
  usage: 'about',
  execute: () => ({
    isError: false,
    output: [
      `  ${ABOUT.name.toUpperCase()} — About Me`,
      '',
      `  Name:       ${ABOUT.name}`,
      `  Role:       ${ABOUT.role}`,
      `  Location:   ${ABOUT.location}`,
      `  Education:  ${ABOUT.education}`,
      '',
      ...ABOUT.summary.match(/.{1,60}/g)!.map(l => `  ${l}`),
      '',
      `  🏆 ${ABOUT.awards}`,
      '',
      '  Run "skills" to see my tech stack',
      '  Run "projects" to see my work',
      '  Run "contact" to reach me',
    ].join('\n'),
  }),
});
