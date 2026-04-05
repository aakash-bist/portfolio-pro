import { CommandFactory } from './command-factory';

export const createStartxCommand: CommandFactory = () => ({
  name: 'startx',
  description: 'Launch graphical desktop environment',
  usage: 'startx',
  execute: () => ({
    output: 'Starting AAKASH_OS Desktop Environment...',
    isError: false,
    startGui: true,
  }),
});
