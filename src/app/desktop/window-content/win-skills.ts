import { Component } from '@angular/core';

interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}

@Component({
  selector: 'app-win-skills',
  standalone: true,
  template: `
    <div class="skills-content">
      <h3>Technical Skills</h3>
      @for (cat of categories; track cat.name) {
        <div class="category">
          <h4>{{ cat.name }}</h4>
          @for (skill of cat.skills; track skill.name) {
            <div class="skill-row">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-bar">
                <div class="skill-fill" [style.width.%]="skill.level"></div>
              </div>
              <span class="skill-pct">{{ skill.level }}%</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .skills-content {
      padding: 20px;
      color: #ddd;
      font-family: -apple-system, 'Segoe UI', sans-serif;
    }
    h3 { margin: 0 0 16px; color: #fff; font-size: 18px; }
    h4 { margin: 16px 0 8px; color: #00ff41; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
    .skill-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .skill-name { width: 100px; font-size: 13px; color: #bbb; }
    .skill-bar { flex: 1; height: 6px; background: #333; border-radius: 3px; overflow: hidden; }
    .skill-fill { height: 100%; background: linear-gradient(90deg, #00ff41, #00cc33); border-radius: 3px; transition: width 0.5s; }
    .skill-pct { width: 36px; text-align: right; font-size: 12px; color: #888; }
  `,
})
export class WinSkillsComponent {
  categories: SkillCategory[] = [
    { name: 'Frontend', skills: [{ name: 'Angular 2+', level: 95 }, { name: 'React', level: 80 }, { name: 'Tailwind CSS', level: 85 }, { name: 'Bootstrap', level: 80 }, { name: 'Angular Material', level: 85 }] },
    { name: 'Backend', skills: [{ name: 'Node.js', level: 90 }, { name: 'NestJS', level: 80 }, { name: 'Express.js', level: 85 }] },
    { name: 'Databases', skills: [{ name: 'MongoDB', level: 90 }, { name: 'PostgreSQL', level: 80 }, { name: 'MySQL', level: 80 }, { name: 'Redis', level: 75 }, { name: 'Elasticsearch', level: 75 }, { name: 'Redshift', level: 75 }, { name: 'Snowflake', level: 70 }] },
    { name: 'Tools & Platforms', skills: [{ name: 'Docker', level: 80 }, { name: 'Git', level: 95 }, { name: 'Firebase', level: 80 }, { name: 'Vercel', level: 80 }, { name: 'Cypress', level: 75 }, { name: 'n8n', level: 70 }] },
  ];
}
