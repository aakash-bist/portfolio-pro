import { CommandFactory } from './command-factory';
import { RESUME_URL } from '../../../shared/data/portfolio.data';

export const createResumeCommand: CommandFactory = () => ({
  name: 'resume',
  description: 'Download resume',
  usage: 'resume',
  execute: () => ({
    isError: false,
    output: 'Downloading resume...',
    downloadFile: RESUME_URL,
  }),
});
