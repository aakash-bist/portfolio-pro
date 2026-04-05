import { Component } from '@angular/core';
import { ABOUT, RESUME_URL } from '../../shared/data/portfolio.data';

@Component({
  selector: 'app-win-about',
  standalone: true,
  template: `
    <div class="about-content">
      <img class="avatar" src="profile.png" alt="{{ about.name }}" />
      <h2>{{ about.name }}</h2>
      <p class="role">{{ about.role }}</p>
      <p class="location">📍 {{ about.location }}</p>
      <hr />
      <p>{{ about.summary }}</p>
      <div class="details">
        <div class="detail-item">
          <span class="detail-label">🎓 Education</span>
          <span class="detail-value">{{ about.education }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🏆 Awards</span>
          <span class="detail-value">{{ about.awards }}</span>
        </div>
      </div>
      <a class="download-btn" [href]="resumeUrl" target="_blank" rel="noopener">
        📄 Download Resume
      </a>
    </div>
  `,
  styles: `
    .about-content {
      padding: 32px;
      color: #ddd;
      font-family: -apple-system, 'Segoe UI', sans-serif;
      text-align: center;
    }
    .avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #00ff41;
      margin: 0 auto 16px;
      display: block;
    }
    @media (max-width: 600px) {
      .about-content { padding: 16px; }
      .avatar { width: 90px; height: 90px; }
      h2 { font-size: 20px; }
      .detail-item { flex-direction: column; gap: 2px; }
    }
    h2 { margin: 0 0 4px; color: #fff; font-size: 24px; }
    .role { color: #00ff41; margin: 0 0 4px; font-size: 14px; }
    .location { color: #888; margin: 0 0 16px; font-size: 13px; }
    hr { border: none; border-top: 1px solid #333; margin: 16px 0; }
    p { color: #aaa; font-size: 14px; line-height: 1.6; margin: 8px 0; }
    .details { margin-top: 16px; text-align: left; }
    .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a2a2a; }
    .detail-label { color: #888; font-size: 13px; }
    .detail-value { color: #ddd; font-size: 13px; }
    .download-btn {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 24px;
      background: #00ff41;
      color: #111;
      border-radius: 6px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }
    .download-btn:hover { background: #00cc33; }
  `,
})
export class WinAboutComponent {
  readonly about = ABOUT;
  readonly resumeUrl = RESUME_URL;
}
