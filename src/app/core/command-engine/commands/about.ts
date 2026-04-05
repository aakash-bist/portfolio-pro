import { CommandFactory } from './command-factory';

export const createAboutCommand: CommandFactory = () => ({
  name: 'about',
  description: 'About me',
  usage: 'about',
  execute: () => ({
    isError: false,
    output: [
      '╔════════════════════════════════════════════════════════╗',
      '║             AAKASH BIST — About Me                    ║',
      '╠════════════════════════════════════════════════════════╣',
      '║  Name:       Aakash Bist                              ║',
      '║  Role:       Full Stack Developer | 6+ Years Exp      ║',
      '║  Location:   Noida, India                             ║',
      '║  Education:  B.Tech CSE — MDU Rohtak (GPA: 8.1)       ║',
      '╠════════════════════════════════════════════════════════╣',
      '║                                                        ║',
      '║  Full Stack Developer with 6+ years of experience      ║',
      '║  building scalable web applications using MEAN and     ║',
      '║  MERN stacks. Skilled in cloud platforms, database     ║',
      '║  management, and leading cross-functional teams to     ║',
      '║  deliver impactful solutions.                          ║',
      '║                                                        ║',
      '╠════════════════════════════════════════════════════════╣',
      '║  🏆 Smart India Hackathon Winner (2019 & 2020)         ║',
      '╠════════════════════════════════════════════════════════╣',
      '║  Run "skills" to see my tech stack                     ║',
      '║  Run "projects" to see my work                         ║',
      '║  Run "contact" to reach me                             ║',
      '╚════════════════════════════════════════════════════════╝',
    ].join('\n'),
  }),
});
