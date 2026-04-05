import { Component } from '@angular/core';

@Component({
  selector: 'app-win-contact',
  standalone: true,
  template: `
    <div class="contact-content">
      <h3>Get In Touch</h3>
      <div class="contact-item">
        <span class="label">📍 Location</span>
        <span class="value">Noida, India</span>
      </div>
      <div class="contact-item">
        <span class="label">📞 Phone</span>
        <span class="value">(+91) 9555747477</span>
      </div>
      <div class="contact-item">
        <span class="label">✉️ Email</span>
        <a class="value" href="mailto:aakashbist&#64;outlook.com">aakashbist&#64;outlook.com</a>
      </div>
      <div class="contact-item">
        <span class="label">🔗 LinkedIn</span>
        <a class="value" href="https://linkedin.com/in/aakash-bist" target="_blank">linkedin.com/in/aakash-bist</a>
      </div>
      <div class="contact-item">
        <span class="label">💻 GitHub</span>
        <a class="value" href="https://github.com/aakash-bist" target="_blank">github.com/aakash-bist</a>
      </div>
      <hr />
      <p class="cta">Open to opportunities! Feel free to reach out.</p>
    </div>
  `,
  styles: `
    .contact-content {
      padding: 28px;
      color: #ddd;
      font-family: -apple-system, 'Segoe UI', sans-serif;
    }
    h3 { margin: 0 0 20px; color: #fff; font-size: 18px; }
    .contact-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #2a2a2a;
    }
    .label { color: #888; font-size: 13px; }
    .value { color: #60a5fa; font-size: 13px; }
    hr { border: none; border-top: 1px solid #333; margin: 16px 0; }
    .cta { color: #00ff41; font-size: 14px; text-align: center; }
  `,
})
export class WinContactComponent {}
