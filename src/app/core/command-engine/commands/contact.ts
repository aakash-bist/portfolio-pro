import { CommandFactory } from './command-factory';
import { CONTACT } from '../../../shared/data/portfolio.data';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const createContactCommand: CommandFactory = () => ({
  name: 'contact',
  description: 'Display contact information',
  usage: 'contact',
  execute: () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

    const rows = CONTACT.map(c => {
      const val = c.href
        ? `<a href="${esc(c.href)}" target="_blank" rel="noopener" class="term-link">${esc(c.value)}</a>`
        : esc(c.value);

      return isMobile
        ? `  ${c.icon} ${esc(c.label)}\n     ${val}`
        : `  ${c.icon}  ${esc(c.label).padEnd(12)} ${val}`;
    });

    return {
      isError: false,
      isHtml: true,
      output: [
        '',
        '  Contact Me',
        '  ──────────',
        '',
        ...rows,
        '',
        isMobile
          ? '  💬 Open to opportunities!'
          : '  💬 Open to opportunities — feel free to reach out!',
        '',
      ].join('\n'),
    };
  },
});
