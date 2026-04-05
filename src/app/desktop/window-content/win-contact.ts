import { Component } from '@angular/core';
import { CONTACT } from '../../shared/data/portfolio.data';

@Component({
  selector: 'app-win-contact',
  standalone: true,
  template: `
    <div class="contact-content">
      <h3>Get In Touch</h3>
      @for (c of contacts; track c.label) {
        <div class="contact-item">
          <span class="label">{{ c.icon }} {{ c.label }}</span>
          @if (c.href) {
            <a class="value" [href]="c.href" target="_blank">{{ c.value }}</a>
          } @else {
            <span class="value">{{ c.value }}</span>
          }
        </div>
      }
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
export class WinContactComponent {
  readonly contacts = CONTACT;
}
