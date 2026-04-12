import { Component } from '@angular/core';
import { EXPERIENCE, computeDuration } from '../../shared/data/portfolio.data';

@Component({
  selector: 'app-win-experience',
  standalone: true,
  template: `
    <div class="experience-content">
      <h3>Work Experience</h3>
      @for (exp of experience; track exp.company) {
        <div class="exp-card">
          <div class="exp-header">
            <span class="exp-title">{{ exp.title }}</span>
            <span class="exp-period">{{ exp.period }} · {{ getDuration(exp.period) }}</span>
          </div>
          <span class="exp-company">{{ exp.company }}</span>
          <ul class="exp-highlights">
            @for (h of exp.highlights; track h) {
              <li>{{ h }}</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: `
    .experience-content {
      padding: 20px;
      color: #ddd;
      font-family: -apple-system, 'Segoe UI', sans-serif;
    }
    h3 { margin: 0 0 16px; color: #fff; font-size: 18px; }
    .exp-card {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 10px;
    }
    .exp-card:hover { border-color: #555; }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .exp-title { color: #fff; font-weight: 600; font-size: 14px; }
    .exp-period { color: #00ff41; font-size: 12px; white-space: nowrap; }
    .exp-company { color: #999; font-size: 13px; }
    .exp-highlights {
      margin: 8px 0 0;
      padding-left: 18px;
      color: #bbb;
      font-size: 13px;
    }
    .exp-highlights li { margin-bottom: 3px; }
    @media (max-width: 600px) {
      .experience-content { padding: 12px; }
      .exp-card { padding: 10px; }
      .exp-header { flex-direction: column; align-items: flex-start; gap: 4px; }
    }
  `,
})
export class WinExperienceComponent {
  readonly experience = EXPERIENCE;

  getDuration(period: string): string {
    return computeDuration(period);
  }
}
