import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatDialogModule, MatTabsModule],
  template: `
    <div class="auth-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <button class="back-btn" (click)="close()">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <!-- Login Form -->
      @if (mode === 'login') {
        <div class="form-container">
          <div class="form-title">
            <h2>{{ i18n.t().auth.loginTitle }}</h2>
            <p>{{ i18n.t().auth.loginSubtitle }}</p>
          </div>

          <form class="auth-form" (ngSubmit)="login()">
            <input type="email" [(ngModel)]="loginEmail" name="email"
                   [placeholder]="i18n.t().auth.email" required class="form-input">
            <div class="password-field">
              <input [type]="showLoginPassword ? 'text' : 'password'" [(ngModel)]="loginPassword" name="password"
                     [placeholder]="i18n.t().auth.password" required class="form-input">
              <button type="button" class="eye-btn" (mousedown)="$event.preventDefault()" (click)="showLoginPassword = !showLoginPassword">
                <mat-icon>{{ showLoginPassword ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
            </div>

            @if (error) {
              <div class="error-message">{{ error }}</div>
            }

            <button type="submit" class="submit-btn" [disabled]="loading">
              {{ loading ? i18n.t().auth.loggingIn : i18n.t().auth.login }}
            </button>
          </form>

          <div class="switch-mode">
            <p>{{ i18n.t().auth.noAccount }}</p>
            <button (click)="mode = 'register'">{{ i18n.t().auth.register }}</button>
          </div>
        </div>
      }

      <!-- Register Form -->
      @if (mode === 'register') {
        <div class="form-container">
          <div class="form-title">
            <h2>{{ i18n.t().auth.registerTitle }}</h2>
            <p>{{ i18n.t().auth.registerSubtitle }}</p>
          </div>

          <form class="auth-form" (ngSubmit)="register()">
            <input type="text" [(ngModel)]="regName" name="name"
                   [placeholder]="i18n.t().auth.name" required class="form-input">
            <input type="email" [(ngModel)]="regEmail" name="email"
                   [placeholder]="i18n.t().auth.email" required class="form-input">
            <input type="tel" [(ngModel)]="regPhone" name="phone"
                   [placeholder]="i18n.t().auth.phone" required class="form-input">
            <div class="password-field">
              <input [type]="showRegPassword ? 'text' : 'password'" [(ngModel)]="regPassword" name="password"
                     [placeholder]="i18n.t().auth.passwordHint" required minlength="6" class="form-input">
              <button type="button" class="eye-btn" (mousedown)="$event.preventDefault()" (click)="showRegPassword = !showRegPassword">
                <mat-icon>{{ showRegPassword ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
            </div>

            @if (error) {
              <div class="error-message">{{ error }}</div>
            }

            <button type="submit" class="submit-btn" [disabled]="loading">
              {{ loading ? i18n.t().auth.registering : i18n.t().auth.register }}
            </button>
          </form>

          <div class="switch-mode">
            <p>{{ i18n.t().auth.hasAccount }}</p>
            <button (click)="mode = 'login'">{{ i18n.t().auth.login }}</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .auth-dialog {
      background: rgba(15, 15, 15, 0.95);
      min-height: 100vh;
      min-height: 100dvh;
      padding: clamp(12px, 4vw, 20px);
      padding-bottom: env(safe-area-inset-bottom, 20px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }

    .dialog-header {
      margin-bottom: clamp(16px, 6vw, 32px);
    }

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
    }

    .form-container {
      max-width: 400px;
      margin: 0 auto;
    }

    .form-title {
      text-align: center;
      margin-bottom: clamp(20px, 6vw, 32px);

      h2 {
        font-size: clamp(16px, 5vw, 20px);
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 8px;
      }

      p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-input {
      width: 100%;
      padding: clamp(12px, 4vw, 16px) clamp(14px, 4.5vw, 20px);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      font-size: clamp(13px, 3.8vw, 14px);
      color: rgba(255, 255, 255, 0.9);
      outline: none;
      font-family: inherit;

      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }

      &:focus {
        border-color: rgba(201, 169, 110, 0.3);
        box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.1);
      }
    }

    .password-field {
      position: relative;

      .form-input {
        padding-right: 48px;
      }

      .eye-btn {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.3);
        cursor: pointer;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &:active {
          color: #c9a96e;
        }
      }
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 13px;
      text-align: center;
    }

    .submit-btn {
      width: 100%;
      padding: clamp(14px, 4.5vw, 18px);
      background: linear-gradient(135deg, #c9a96e, #dfc598);
      color: #0a0a0a;
      border: none;
      border-radius: 12px;
      font-size: clamp(9px, 2.8vw, 10px);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      cursor: pointer;
      margin-top: 8px;
      box-shadow: 0 8px 24px rgba(201, 169, 110, 0.2);

      &:disabled {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.25);
        cursor: not-allowed;
        box-shadow: none;
      }

      &:active:not(:disabled) {
        box-shadow: 0 12px 30px rgba(201, 169, 110, 0.35);
      }
    }

    .switch-mode {
      text-align: center;
      margin-top: clamp(20px, 6vw, 32px);
      padding-top: clamp(16px, 5vw, 24px);
      border-top: 1px solid rgba(255, 255, 255, 0.06);

      p {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
        margin-bottom: 8px;
      }

      button {
        background: none;
        border: none;
        font-size: 12px;
        color: #c9a96e;
        font-weight: 500;
        cursor: pointer;
      }
    }

    @media (min-width: 768px) {
      .auth-dialog {
        min-height: auto;
        padding: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .dialog-header {
        width: 100%;
        max-width: 400px;
      }

      .form-title h2 {
        font-size: 22px;
      }

      .submit-btn:hover:not(:disabled) {
        box-shadow: 0 14px 40px rgba(201, 169, 110, 0.35);
      }
    }
  `]
})
export class AuthDialogComponent {
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<AuthDialogComponent>);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  readonly i18n = inject(I18nService);

  mode: 'login' | 'register' = 'register';
  error = '';
  loading = false;
  showLoginPassword = false;
  showRegPassword = false;

  // Login
  loginEmail = '';
  loginPassword = '';

  // Register
  regName = '';
  regEmail = '';
  regPhone = '';
  regPassword = '';

  close() {
    this.dialogRef.close(false);
  }

  login() {
    if (!this.loginEmail || !this.loginPassword) {
      this.error = this.i18n.t().auth.fillAllFields;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.loading = false;
          this.error = err.error?.error || this.i18n.t().auth.loginError;
          this.cdr.detectChanges();
        });
      }
    });
  }

  register() {
    if (!this.regName || !this.regEmail || !this.regPhone || !this.regPassword) {
      this.error = this.i18n.t().auth.fillAllFields;
      this.cdr.detectChanges();
      return;
    }

    if (this.regPassword.length < 6) {
      this.error = this.i18n.t().auth.passwordTooShort;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.authService.register({
      name: this.regName,
      email: this.regEmail,
      phone: this.regPhone,
      password: this.regPassword
    }).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
          this.dialogRef.close(true);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.loading = false;
          this.error = err.error?.error || this.i18n.t().auth.registerError;
          this.cdr.detectChanges();
        });
      }
    });
  }
}
