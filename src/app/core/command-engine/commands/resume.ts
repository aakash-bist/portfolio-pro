import { CommandFactory } from './command-factory';

const RESUME_URL = 'https://drive.google.com/uc?export=download&id=1aycqtFzpT93uc2sVx3Z_i7apB5atp9Sy';

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
