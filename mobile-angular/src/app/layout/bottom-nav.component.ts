import { Component, inject, ViewChild, ElementRef, AfterViewInit, DestroyRef, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { I18nService } from '../core/services/i18n.service';
import { ScrollRevealState } from '../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MatTabsModule, MatIconModule],
  template: `
    <div class="app-container">
      <main class="content" #scrollContainer>
        <router-outlet></router-outlet>
      </main>

      <nav class="bottom-nav">
        <a routerLink="/home" routerLinkActive="active" class="nav-item">
          <mat-icon>home</mat-icon>
          <span>{{ i18n.t().nav.home }}</span>
        </a>
        <a routerLink="/menu" routerLinkActive="active" class="nav-item">
          <mat-icon>restaurant_menu</mat-icon>
          <span>{{ i18n.t().nav.menu }}</span>
        </a>
        <a routerLink="/reservation" routerLinkActive="active" class="nav-item">
          <mat-icon>event</mat-icon>
          <span>{{ i18n.t().nav.reservation }}</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      height: 100dvh;
      background: #0a0a0a;
      position: relative;
      overflow: hidden;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior-y: none;
      padding-bottom: 80px;
      background: #0a0a0a;
      -webkit-overflow-scrolling: touch;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: rgba(10, 10, 10, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      gap: 4px;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      padding: 0 8px;
      padding-bottom: env(safe-area-inset-bottom, 0);
      z-index: 1000;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px 0;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
      border-radius: 16px;
      flex: 1;
      text-align: center;

      mat-icon {
        font-size: clamp(20px, 6vw, 24px);
        width: clamp(20px, 6vw, 24px);
        height: clamp(20px, 6vw, 24px);
      }

      span {
        font-size: clamp(8px, 2.8vw, 10px);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      &.active {
        color: #c9a96e;
        background: rgba(201, 169, 110, 0.08);

        mat-icon {
          transform: scale(1.1);
        }
      }
    }

    @media (min-width: 768px) {
      .content {
        max-width: 720px;
        margin: 0 auto;
        width: 100%;
      }

      .bottom-nav {
        max-width: 480px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 24px;
        bottom: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
    }

    @media (min-width: 1024px) {
      .content {
        max-width: 960px;
      }
    }

    @media (min-width: 1280px) {
      .content {
        max-width: 1100px;
      }
    }
  `]
})
export class BottomNavComponent implements AfterViewInit {
  readonly i18n = inject(I18nService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private revealState = inject(ScrollRevealState);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  constructor() {
    // Force re-render when language changes
    effect(() => {
      this.i18n.language();
      this.cdr.detectChanges();
    });
  }

  private scrollPositions = new Map<string, number>();
  private isPopstate = false;

  ngAfterViewInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((e: NavigationStart) => {
      const url = this.router.url;
      this.scrollPositions.set(url, this.scrollContainer.nativeElement.scrollTop);
      this.isPopstate = e.navigationTrigger === 'popstate';
      this.revealState.skipAnimations = this.isPopstate;
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((e: NavigationEnd) => {
      requestAnimationFrame(() => {
        if (this.isPopstate) {
          const saved = this.scrollPositions.get(e.urlAfterRedirects) ?? 0;
          this.scrollContainer.nativeElement.scrollTo(0, saved);
        } else {
          this.scrollContainer.nativeElement.scrollTo(0, 0);
          window.scrollTo(0, 0);
        }
      });
    });
  }
}
