import { Component } from '@angular/core';
import { PROJECTS } from '../../shared/data/portfolio.data';

@Component({
  selector: 'app-win-projects',
  standalone: true,
  template: `
    <div class="projects-content">
      <h3>Projects</h3>
      @for (p of projects; track p.name) {
        <div class="project-card">
          <div class="project-header">
            <span class="project-name">{{ p.name }}</span>
            <span class="project-status" [class]="p.status.toLowerCase().replace(' ', '-')">{{ p.status }}</span>
          </div>
          <p class="project-desc">{{ p.desc }}</p>
          <span class="project-tech">{{ p.tech }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .projects-content {
      padding: 20px;
      color: #ddd;
      font-family: -apple-system, 'Segoe UI', sans-serif;
    }
    h3 { margin: 0 0 16px; color: #fff; font-size: 18px; }
    .project-card {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 10px;
    }
    .project-card:hover { border-color: #555; }
    .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .project-name { color: #fff; font-weight: 600; font-size: 14px; }
    .project-status {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      background: #333;
      color: #aaa;
    }
    .project-status.in-development { background: #1a3a1a; color: #4ade80; }
    .project-status.completed { background: #1a2a3a; color: #60a5fa; }
    .project-status.archived { background: #3a2a1a; color: #f59e0b; }
    .project-desc { color: #999; font-size: 13px; margin: 4px 0 8px; }
    .project-tech { color: #666; font-size: 12px; }
    @media (max-width: 600px) {
      .projects-content { padding: 12px; }
      .project-card { padding: 10px; }
      .project-header { flex-direction: column; align-items: flex-start; gap: 4px; }
    }
  `,
})
export class WinProjectsComponent {
  readonly projects = PROJECTS;
}
