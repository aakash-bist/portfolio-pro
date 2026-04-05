import { Component } from '@angular/core';

@Component({
  selector: 'app-win-about',
  standalone: true,
  template: `
    <div class="about-content">
      <div class="avatar">AB</div>
      <h2>Aakash Bist</h2>
      <p class="role">Full Stack Developer | 6+ Years Experience</p>
      <p class="location">📍 Noida, India</p>
      <hr />
      <p>Full Stack Developer with 6+ years of experience building scalable web applications using MEAN and MERN stacks. Skilled in cloud platforms, database management, and leading cross-functional teams to deliver impactful solutions.</p>
      <div class="details">
        <div class="detail-item">
          <span class="detail-label">🎓 Education</span>
          <span class="detail-value">B.Tech CSE — MDU Rohtak (GPA: 8.1)</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">🏆 Awards</span>
          <span class="detail-value">Smart India Hackathon Winner (2019 & 2020)</span>
        </div>
      </div>
      <a class="download-btn" href="https://drive.google.com/uc?export=download&id=1aycqtFzpT93uc2sVx3Z_i7apB5atp9Sy" target="_blank" rel="noopener">
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
      width: 80px;
      height: 80px;
      background: #00ff41;
      color: #111;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: bold;
      margin: 0 auto 16px;
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
export class WinAboutComponent {}
