// ─── Single source of truth for all portfolio content ───
// Used by: terminal commands, GUI windows, and filesystem

export const RESUME_URL = 'https://drive.google.com/uc?export=download&id=1aycqtFzpT93uc2sVx3Z_i7apB5atp9Sy';

export interface AboutData {
  name: string;
  initials: string;
  role: string;
  location: string;
  education: string;
  summary: string;
  awards: string;
}

export const ABOUT: AboutData = {
  name: 'Aakash Bist',
  initials: 'AB',
  role: 'Full Stack Developer | 6+ Years Experience',
  location: 'Noida, India',
  education: 'B.Tech CSE — MDU Rohtak (GPA: 8.1)',
  summary:
    'Full Stack Developer with 6+ years of experience building scalable web applications using MEAN and MERN stacks. Skilled in cloud platforms, database management, and leading cross-functional teams to deliver impactful solutions.',
  awards: 'Smart India Hackathon Winner (2019 & 2020)',
};

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export const CONTACT: ContactItem[] = [
  { icon: '📍', label: 'Location', value: 'Noida, India' },
  { icon: '📞', label: 'Phone', value: '(+91) 9555747477' },
  { icon: '📧', label: 'Email', value: 'aakashbist@outlook.com', href: 'mailto:aakashbist@outlook.com' },
  { icon: '🔗', label: 'LinkedIn', value: 'linkedin.com/in/aakash-bist', href: 'https://linkedin.com/in/aakash-bist' },
  { icon: '💻', label: 'GitHub', value: 'github.com/aakash-bist', href: 'https://github.com/aakash-bist' },
];

export interface ProjectItem {
  id: number;
  name: string;
  tech: string;
  desc: string;
  url: string;
}

export const PROJECTS: ProjectItem[] = [
  { id: 1, name: 'SC Analytics', tech: 'Angular, Express.js, Redis, MySQL, MongoDB, Redshift, Elasticsearch', desc: 'Powerful data querying system using Amazon Redshift with interactive filters, widgets, and dynamic visualizations', url: '' },
  { id: 2, name: 'MR Reporting', tech: 'Angular, Loopback 3, MongoDB', desc: 'B2B SaaS platform used by 2000+ clients for field activity management, boosting efficiency by 40%', url: '' },
  { id: 3, name: 'Dhaam Organics', tech: 'React, Node.js, MongoDB, Cloudinary, Material UI', desc: 'Complete e-commerce application streamlining the farm-to-table experience', url: '' },
  { id: 4, name: 'STET Sikkim', tech: 'Angular, Node.js, MongoDB', desc: 'Record management system for Sikkim Govt — Smart India Hackathon winning solution', url: '' },
  { id: 5, name: 'AAKASH_OS', tech: 'Angular, TypeScript, Tailwind', desc: 'Terminal-based portfolio OS simulating a Linux desktop environment', url: 'https://github.com/aakash-bist/aakash-os' },
];

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export const SKILLS: SkillCategory[] = [
  { name: 'Frontend', skills: [
    { name: 'Angular 2+', level: 95 },
    { name: 'React', level: 80 },
    { name: 'Tailwind CSS', level: 85 },
    { name: 'Bootstrap', level: 80 },
    { name: 'Angular Material', level: 85 },
  ]},
  { name: 'Backend', skills: [
    { name: 'Node.js', level: 90 },
    { name: 'NestJS', level: 80 },
    { name: 'Express.js', level: 85 },
  ]},
  { name: 'Databases', skills: [
    { name: 'MongoDB', level: 90 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 80 },
    { name: 'Redis', level: 75 },
    { name: 'Elasticsearch', level: 75 },
    { name: 'Amazon Redshift', level: 75 },
    { name: 'Snowflake', level: 70 },
  ]},
  { name: 'Tools & Platforms', skills: [
    { name: 'Docker', level: 80 },
    { name: 'Git', level: 95 },
    { name: 'Firebase', level: 80 },
    { name: 'Vercel', level: 80 },
    { name: 'Cypress', level: 75 },
    { name: 'n8n', level: 70 },
  ]},
];

export interface WorkExperience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function computeDuration(period: string): string {
  const parts = period.split(' - ');
  const [startMon, startYr] = parts[0].split(' ');
  const start = new Date(+startYr, MONTH_MAP[startMon]);

  let end: Date;
  if (parts[1].trim() === 'Present') {
    end = new Date();
  } else {
    const [endMon, endYr] = parts[1].trim().split(' ');
    end = new Date(+endYr, MONTH_MAP[endMon]);
  }

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 1) months = 1;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;

  if (yrs === 0) return `${mos} mo${mos !== 1 ? 's' : ''}`;
  if (mos === 0) return `${yrs} yr${yrs !== 1 ? 's' : ''}`;
  return `${yrs} yr${yrs !== 1 ? 's' : ''} ${mos} mo${mos !== 1 ? 's' : ''}`;
}

export const EXPERIENCE: WorkExperience[] = [
  {
    title: 'Sr. Software Developer',
    company: 'SupplyCopia',
    period: 'May 2025 - Present',
    highlights: [
      'Transitioned from Algoscale for high-impact delivery',
      'Integrated Snowflake for 60% faster query response',
      'Improved data pipelines and cloud integrations',
    ],
  },
  {
    title: 'Team Lead (MEAN Stack)',
    company: 'Algoscale',
    period: 'Aug 2021 - Apr 2025',
    highlights: [
      'Led team of 5, integrated 150+ European hospitals',
      '30% faster response, 20% improved stability',
      'Expanded service reach to 1400+ hospitals',
    ],
  },
  {
    title: 'MEAN Stack Developer',
    company: 'E-Tech Services',
    period: 'Jan 2020 - Aug 2021',
    highlights: [
      'Optimized APIs, 30% faster data retrieval',
      'Implemented agile, 20% delivery efficiency gain',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'Planify (Intern)',
    period: 'Aug 2019 - Nov 2019',
    highlights: ['Built interactive UIs with design team'],
  },
];
