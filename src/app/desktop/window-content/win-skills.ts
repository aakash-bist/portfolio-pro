import { Component } from '@angular/core';
import { SKILLS } from '../../shared/data/portfolio.data';

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
  readonly categories = SKILLS;
}
