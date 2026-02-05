import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { I18nService, Language } from '../../core/services/i18n.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, ScrollRevealDirective],
  template: `
    <div class="home-page">
      <!-- Language Selector -->
      <div class="language-selector">
        @for (lang of i18n.languages; track lang.code) {
          <button
            class="lang-btn"
            [class.active]="i18n.language() === lang.code"
            (click)="i18n.setLanguage(lang.code)">
            {{ lang.flag }}
          </button>
        }
      </div>

      <!-- Hero Section -->
      <section class="hero">
        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070"
             alt="Restaurant" class="hero-bg">
        <div class="hero-overlay"></div>

        <!-- Side text: left -->
        <div class="side-text side-left">
          <span class="side-diamond"></span>
          <span class="side-label">{{ i18n.t().home.fineDiningLabel }}</span>
          <span class="side-diamond"></span>
        </div>

        <!-- Side text: right -->
        <div class="side-text side-right">
          <span class="side-diamond"></span>
          <span class="side-label">{{ i18n.t().home.established }}</span>
          <span class="side-diamond"></span>
        </div>

        <div class="hero-content" appReveal>
          <div class="season-line">
            <span class="diamond"></span>
            <p class="season">{{ i18n.t().home.season }}</p>
            <span class="diamond"></span>
          </div>
          <h1>{{ i18n.t().home.heroTitle }}</h1>
          <a routerLink="/reservation" class="cta-button">
            {{ i18n.t().home.ctaButton }}
          </a>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator">
          <span>{{ i18n.t().home.scroll }}</span>
          <div class="scroll-line"></div>
        </div>
      </section>

      <div class="home-bottom">
        <!-- Philosophy Section -->
        <section class="philosophy" appReveal [revealDelay]="100">
          <p class="label">{{ i18n.t().home.philosophy }}</p>
          <h2 [innerHTML]="i18n.t().home.philosophyTitle.replace('\\n', '<br>')"></h2>
          <p class="description">{{ i18n.t().home.philosophyText }}</p>
        </section>

        <!-- Image Section -->
        <section class="image-section" appReveal [revealDelay]="120">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974"
               alt="Fine Dining" class="feature-image">
        </section>

        <!-- Quote Section -->
        <section class="quote-section" appReveal [revealDelay]="80">
          <div class="quote-card">
            <p>{{ i18n.t().home.quote }}</p>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section" appReveal [revealDelay]="100">
          <h3>{{ i18n.t().home.joinUs }}</h3>
          <a routerLink="/reservation" class="cta-button-dark">
            {{ i18n.t().home.secureSpot }}
          </a>
        </section>

        <!-- Info Section -->
        <section class="info-section" appReveal [revealDelay]="80">
          <div class="info-item">
            <mat-icon>place</mat-icon>
            <p>{{ i18n.t().home.address }}</p>
          </div>
          <div class="info-item">
            <mat-icon>schedule</mat-icon>
            <p>{{ i18n.t().home.hours }}</p>
          </div>
        </section>

        <!-- Footer -->
        <footer class="footer" appReveal>
          <p class="logo">AURA</p>
          <p class="copyright">{{ i18n.t().home.copyright }}</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .home-page {
      background: #0a0a0a;
    }

    .home-bottom {
      background: #0a0a0a;
    }

    .language-selector {
      position: absolute;
      top: calc(env(safe-area-inset-top, 0px) + 8px);
      right: 16px;
      z-index: 100;
      display: flex;
      gap: 8px;
      background: rgba(10, 10, 10, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 6px;
      border-radius: 20px;
    }

    .lang-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 50%;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: rgba(201, 169, 110, 0.2);
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .hero {
      position: relative;
      height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      // Frosted glass blur over status bar area
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: env(safe-area-inset-top, 0px);
        -webkit-backdrop-filter: saturate(180%) blur(12px);
        backdrop-filter: saturate(180%) blur(12px);
        background: rgba(0, 0, 0, 0.15);
        z-index: 3;
      }
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%);
    }

    .side-text {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 2;
    }

    .side-left {
      left: 8px;
    }

    .side-right {
      right: 8px;
    }

    @media (max-width: 359px) {
      .side-text {
        display: none;
      }
    }

    .side-diamond {
      width: 5px;
      height: 5px;
      background: rgba(201, 169, 110, 0.35);
      transform: rotate(45deg);
    }

    .side-label {
      writing-mode: vertical-lr;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: rgba(255, 255, 255, 0.25);
      font-weight: 400;
    }

    .side-right .side-label {
      writing-mode: vertical-rl;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      z-index: 2;

      span {
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .scroll-line {
      width: 1px;
      height: 24px;
      background: linear-gradient(to bottom, rgba(201, 169, 110, 0.4), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { opacity: 0.4; height: 24px; }
      50% { opacity: 1; height: 32px; }
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: white;
      padding: 0 clamp(32px, 12vw, 48px);
    }

    .season-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .diamond {
      width: 6px;
      height: 6px;
      background: rgba(201, 169, 110, 0.4);
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    .season {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5em;
      color: rgba(255, 255, 255, 0.6);
    }

    h1 {
      font-size: clamp(26px, 8vw, 36px);
      font-weight: 300;
      font-style: italic;
      letter-spacing: -0.02em;
      margin-bottom: clamp(20px, 6vw, 32px);
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #c9a96e, #dfc598);
      padding: clamp(12px, 3vw, 16px) clamp(24px, 8vw, 32px);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      color: #0a0a0a;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(201, 169, 110, 0.25);

      &:active {
        background: #dfc598;
        box-shadow: 0 12px 30px rgba(201, 169, 110, 0.35);
      }
    }

    .philosophy {
      padding: clamp(40px, 10vw, 64px) clamp(16px, 5vw, 24px);
      text-align: center;
    }

    .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4em;
      color: rgba(201, 169, 110, 0.7);
      margin-bottom: 16px;
    }

    h2 {
      font-size: clamp(20px, 6vw, 24px);
      font-weight: 300;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: clamp(16px, 5vw, 24px);
    }

    .description {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 300;
      line-height: 1.7;
      max-width: 400px;
      margin: 0 auto;
    }

    .image-section {
      padding: 0 clamp(16px, 5vw, 24px) clamp(32px, 8vw, 48px);
    }

    .feature-image {
      width: 100%;
      height: clamp(200px, 50vw, 300px);
      object-fit: cover;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(201, 169, 110, 0.1);
    }

    .quote-section {
      padding: 0 clamp(16px, 5vw, 24px) clamp(32px, 8vw, 48px);
    }

    .quote-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: clamp(20px, 6vw, 32px) clamp(16px, 5vw, 24px);
      border-radius: 16px;
      text-align: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 20%;
        right: 20%;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(201, 169, 110, 0.3), transparent);
      }

      p {
        font-size: clamp(15px, 4.5vw, 18px);
        font-style: italic;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.6;
      }
    }

    .cta-section {
      text-align: center;
      padding: clamp(32px, 8vw, 48px) clamp(16px, 5vw, 24px);

      h3 {
        font-size: clamp(17px, 5vw, 20px);
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 24px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .cta-button-dark {
      display: inline-block;
      background: linear-gradient(135deg, #c9a96e, #dfc598);
      color: #0a0a0a;
      padding: clamp(16px, 4vw, 20px) clamp(32px, 10vw, 48px);
      border-radius: 50px;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      text-decoration: none;
      box-shadow: 0 10px 30px rgba(201, 169, 110, 0.25);

      &:active {
        box-shadow: 0 14px 40px rgba(201, 169, 110, 0.4);
      }
    }

    .info-section {
      padding: clamp(20px, 6vw, 32px) clamp(16px, 5vw, 24px);
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255, 255, 255, 0.5);

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #c9a96e;
      }

      p {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
    }

    .footer {
      text-align: center;
      padding: clamp(32px, 8vw, 48px) clamp(16px, 5vw, 24px) 100px;
      border-top: 1px solid transparent;
      border-image: linear-gradient(to right, transparent, rgba(201, 169, 110, 0.2), transparent) 1;
    }

    .logo {
      font-size: 20px;
      font-weight: 300;
      letter-spacing: 0.3em;
      color: #c9a96e;
      margin-bottom: 12px;
    }

    .copyright {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.3);
    }

    @media (orientation: landscape) and (max-height: 500px) {
      .side-text {
        display: none;
      }

      .scroll-indicator {
        display: none;
      }

      .hero {
        height: 100vh;
        height: 100dvh;
      }

      .hero-content {
        padding: 0 48px;
      }

      h1 {
        font-size: 28px;
        margin-bottom: 20px;
      }

      .season {
        margin-bottom: 10px;
      }

      .cta-button {
        padding: 12px 28px;
      }

      .language-selector {
        top: 10px;
        right: 10px;
        padding: 4px;
      }

      .lang-btn {
        width: 28px;
        height: 28px;
        font-size: 16px;
      }

      .philosophy {
        padding: 40px 48px;
      }

      h2 {
        font-size: 22px;
      }

      .description {
        font-size: 13px;
      }

      .image-section {
        padding: 0 48px 32px;
      }

      .feature-image {
        height: 220px;
      }

      .quote-section {
        padding: 0 48px 32px;
      }

      .quote-card {
        padding: 24px 20px;

        p {
          font-size: 16px;
        }
      }

      .cta-section {
        padding: 32px 48px;

        h3 {
          font-size: 18px;
          margin-bottom: 16px;
        }
      }

      .cta-button-dark {
        padding: 16px 40px;
      }

      .info-section {
        flex-direction: row;
        justify-content: center;
        gap: 32px;
        padding: 24px 48px;
      }

      .footer {
        padding: 32px 48px 60px;
      }
    }

    @media (min-width: 768px) {
      .hero-content {
        padding: 0 48px;
      }

      h1 {
        font-size: 48px;
      }

      .season {
        font-size: 12px;
      }

      .cta-button {
        padding: 18px 40px;
        font-size: 12px;

        &:hover {
          background: linear-gradient(135deg, #dfc598, #c9a96e);
          box-shadow: 0 14px 40px rgba(201, 169, 110, 0.35);
        }
      }

      .philosophy {
        padding: 80px 48px;
      }

      h2 {
        font-size: 30px;
      }

      .description {
        font-size: 16px;
        max-width: 560px;
      }

      .image-section {
        padding: 0 48px 64px;
      }

      .feature-image {
        height: 400px;
        border-radius: 24px;
      }

      .quote-section {
        padding: 0 48px 64px;
      }

      .quote-card {
        padding: 48px 40px;

        p {
          font-size: 22px;
        }
      }

      .cta-section {
        padding: 64px 48px;

        h3 {
          font-size: 24px;
        }
      }

      .cta-button-dark {
        padding: 22px 56px;
        font-size: 12px;

        &:hover {
          background: #dfc598;
          box-shadow: 0 14px 40px rgba(201, 169, 110, 0.3);
        }
      }

      .info-section {
        flex-direction: row;
        justify-content: center;
        gap: 48px;
        padding: 40px 48px;
      }

      .info-item p {
        font-size: 13px;
      }

      .footer {
        padding: 64px 48px 100px;
      }
    }

    @media (min-width: 1024px) {
      h1 {
        font-size: 56px;
      }

      .philosophy {
        padding: 100px 64px;
      }

      h2 {
        font-size: 36px;
      }

      .description {
        font-size: 17px;
        max-width: 640px;
      }

      .image-section {
        padding: 0 64px 80px;
      }

      .feature-image {
        height: 480px;
      }

      .quote-section {
        padding: 0 64px 80px;
        max-width: 800px;
        margin: 0 auto;
      }

      .quote-card p {
        font-size: 26px;
      }

      .cta-section {
        padding: 80px 64px;
      }

      .info-section {
        gap: 64px;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly i18n = inject(I18nService);
  private meta = document.querySelector('meta[name="theme-color"]');

  ngOnInit() {
    this.meta?.setAttribute('content', '#0a0a0a');
  }

  ngOnDestroy() {
    this.meta?.setAttribute('content', '#0a0a0a');
  }
}
