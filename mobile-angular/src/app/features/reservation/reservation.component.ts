import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ScheduleResponse, TimeSlot, ReservationRequest } from '../../core/models/reservation.model';
import { AuthDialogComponent } from '../../shared/components/auth-modal/auth-dialog.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface CalendarDay {
  date: Date;
  day: number;
  dateStr: string;
  status: 'available' | 'limited' | 'full' | 'closed' | 'past' | 'disabled';
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSnackBarModule, ScrollRevealDirective
  ],
  template: `
    <div class="reservation-page">
      @if (authService.currentUser && !success) {
        <!-- Header -->
        <header class="res-header" appReveal [revealDelay]="50">
          <h1>Aura</h1>
          <div class="divider"></div>
          <p class="season">{{ i18n.t().home.season }}</p>
        </header>

        <!-- User Bar -->
        @if (authService.currentUser) {
          <div class="user-bar" appReveal [revealDelay]="180">
            <div class="user-info">
              <div class="user-avatar">{{ authService.currentUser.name.charAt(0) }}</div>
              <span>{{ authService.currentUser.name }}</span>
            </div>
            <button class="logout-btn" (click)="logout()">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        }

        <!-- Calendar -->
        <section class="calendar-section" appReveal [revealDelay]="300">
          <label>{{ i18n.t().reservation.selectDate }}</label>

          <div class="calendar-nav">
            <button (click)="prevMonth()" [disabled]="!canGoPrev" class="nav-btn">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <span class="month-label">{{ i18n.t().reservation.monthNames[currentMonth] }} {{ currentYear }}</span>
            <button (click)="nextMonth()" [disabled]="!canGoNext" class="nav-btn">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>

          <div class="calendar-grid">
            <div class="weekday-header">
              @for (day of i18n.t().reservation.weekdays; track day) {
                <span>{{ day }}</span>
              }
            </div>
            <div class="days-grid">
              @for (day of calendarDays; track day.dateStr) {
                <button class="cal-day"
                        [class.available]="day.status === 'available'"
                        [class.limited]="day.status === 'limited'"
                        [class.full]="day.status === 'full'"
                        [class.closed]="day.status === 'closed'"
                        [class.past]="day.status === 'past'"
                        [class.disabled]="day.status === 'disabled'"
                        [class.today]="day.isToday"
                        [class.selected]="day.isSelected"
                        [disabled]="day.status === 'disabled' || day.status === 'past' || day.status === 'closed' || day.status === 'full'"
                        (click)="selectDate(day)">
                  {{ day.day || '' }}
                </button>
              }
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <div class="legend-item"><span class="dot available"></span>{{ i18n.t().reservation.available }}</div>
            <div class="legend-item"><span class="dot limited"></span>{{ i18n.t().reservation.limited }}</div>
            <div class="legend-item"><span class="dot full"></span>{{ i18n.t().reservation.full }}</div>
            <div class="legend-item"><span class="dot closed"></span>{{ i18n.t().reservation.closed }}</div>
          </div>

          <!-- Selected Date Display -->
          @if (selectedDate) {
            <div class="selected-date-display">
              {{ formatSelectedDate() }}
            </div>
          }
        </section>

        <!-- Time Slots -->
        <section class="slots-section" appReveal [revealDelay]="80">
          <label>{{ i18n.t().reservation.selectTime }}</label>

          @if (loadingSlots) {
            <div class="loading-slots">
              <mat-icon class="spin">sync</mat-icon>
              <p>{{ i18n.t().reservation.loading }}</p>
              <p class="loading-hint">{{ i18n.t().reservation.pleaseWait }}</p>
            </div>
          }

          @if (slotsError && !loadingSlots) {
            <div class="error-slots">
              <mat-icon>cloud_off</mat-icon>
              <p>{{ i18n.t().reservation.error }}</p>
              <button class="retry-btn" (click)="loadSlots(selectedDate!)">
                <mat-icon>refresh</mat-icon>
                {{ i18n.t().reservation.retry }}
              </button>
            </div>
          }

          @if (isClosed && !loadingSlots) {
            <div class="closed-message">
              <p class="closed-title">{{ i18n.t().reservation.closed }}</p>
              <p class="closed-reason">{{ closedReason || i18n.t().reservation.closedDefault }}</p>
            </div>
          }

          @if (!loadingSlots && !isClosed && slots.length > 0) {
            <div class="slots-grid">
              @for (slot of slots; track slot.time) {
                <button class="slot-btn"
                        [class.available]="slot.available > 0"
                        [class.full]="slot.available <= 0"
                        [class.selected]="selectedSlot === slot.time"
                        [disabled]="slot.available <= 0"
                        (click)="selectSlot(slot.time)">
                  <span class="slot-time">{{ slot.time }}</span>
                  <span class="slot-status">{{ slot.available > 0 ? i18n.t().reservation.slotAvailable : i18n.t().reservation.slotFull }}</span>
                </button>
              }
            </div>
          }
        </section>

        <!-- Guest Count -->
        <section class="guests-section" appReveal [revealDelay]="80">
          <label>{{ i18n.t().reservation.guests }}</label>
          <div class="guest-counter">
            <button class="counter-btn" (click)="updateGuests(-1)" [disabled]="guests <= 1">−</button>
            <span class="guest-count">{{ guests }}</span>
            <button class="counter-btn" (click)="updateGuests(1)" [disabled]="guests >= 8">+</button>
          </div>
        </section>

        <!-- Notes -->
        <section class="notes-section" appReveal [revealDelay]="80">
          <label>{{ i18n.t().reservation.specialRequests }}</label>
          <textarea [(ngModel)]="notes" [placeholder]="i18n.t().checkout.noteHint"></textarea>
        </section>

        <!-- Price -->
        <section class="price-section" appReveal [revealDelay]="100">
          <div class="price-row">
            <div>
              <p class="price-label">{{ i18n.t().reservation.pricePerPersonLabel }}</p>
              <p class="price-value">95,00 €</p>
            </div>
            <div class="price-total">
              <p class="price-label">{{ i18n.t().reservation.total }}</p>
              <p class="total-value">{{ (guests * 95).toFixed(2).replace('.', ',') }} €</p>
            </div>
          </div>
        </section>

        <!-- Submit -->
        <button class="submit-btn" appReveal [revealDelay]="150"
                [disabled]="!canSubmit || loading"
                (click)="submitReservation()">
          {{ loading ? i18n.t().reservation.sending : (canSubmit ? i18n.t().reservation.confirmReservation : i18n.t().reservation.selectSlot) }}
        </button>
      }

      @if (authService.currentUser && success) {
        <!-- Success Screen -->
        <div class="success-screen">
          <div class="success-divider"></div>
          <h2>{{ i18n.t().reservation.successTitle }}</h2>
          <div class="success-summary" [innerHTML]="successMessage"></div>
          <button class="back-btn" routerLink="/home">{{ i18n.t().reservation.backToHome }}</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      overflow: hidden;
      background: #0a0a0a;
    }

    .reservation-page {
      background: rgba(15, 15, 15, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      min-height: 100vh;
      padding: clamp(20px, 6vw, 32px) clamp(12px, 4vw, 24px) 120px;
      border-radius: clamp(20px, 6vw, 32px);
      margin: clamp(8px, 2.5vw, 16px);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .res-header {
      text-align: center;
      margin-bottom: 24px;

      h1 {
        font-size: clamp(22px, 6vw, 28px);
        font-weight: 300;
        letter-spacing: 0.4em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.9);
      }

      .divider {
        width: 60px;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(201, 169, 110, 0.5), transparent);
        margin: 16px auto;
      }

      .season {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #c9a96e;
        font-style: italic;
      }
    }

    .user-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 8px 12px 8px 16px;
      border-radius: 50px;
      margin-bottom: 24px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(201, 169, 110, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #c9a96e;
    }

    .user-info span {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
    }

    .logout-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.3);
      cursor: pointer;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    section {
      margin-bottom: 24px;
    }

    label {
      display: block;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #c9a96e;
      margin-bottom: 12px;
    }

    .calendar-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .nav-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .month-label {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    .calendar-grid {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: clamp(8px, 3vw, 16px);
    }

    .weekday-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      margin-bottom: 8px;

      span {
        text-align: center;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.3);
        font-weight: 500;
        padding: 8px 0;
      }
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: clamp(2px, 0.8vw, 4px);
    }

    .cal-day {
      aspect-ratio: 1;
      border: none;
      border-radius: clamp(6px, 2vw, 10px);
      font-size: clamp(11px, 3.2vw, 13px);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &.available {
        background: rgba(16, 185, 129, 0.15);
        color: #6ee7b7;
      }

      &.limited {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
      }

      &.full {
        background: rgba(239, 68, 68, 0.15);
        color: #fca5a5;
        cursor: not-allowed;
      }

      &.closed {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.3);
        text-decoration: line-through;
        cursor: not-allowed;
      }

      &.past, &.disabled {
        background: transparent;
        color: rgba(255, 255, 255, 0.15);
        cursor: not-allowed;
      }

      &.today:not(.selected) {
        outline: 2px solid #c9a96e;
        outline-offset: -2px;
      }

      &.selected {
        background: #c9a96e !important;
        color: #0a0a0a !important;
        font-weight: 700;
      }
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.4);
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 4px;

      &.available { background: rgba(16, 185, 129, 0.15); }
      &.limited { background: rgba(245, 158, 11, 0.15); }
      &.full { background: rgba(239, 68, 68, 0.15); }
      &.closed { background: rgba(255, 255, 255, 0.05); }
    }

    .selected-date-display {
      background: #c9a96e;
      color: #0a0a0a;
      text-align: center;
      padding: 14px;
      border-radius: 12px;
      margin-top: 16px;
      font-size: 13px;
      font-weight: 500;
    }

    .loading-slots, .closed-message {
      text-align: center;
      padding: 24px;
      color: rgba(255, 255, 255, 0.3);

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      p {
        margin-top: 8px;
        font-size: 13px;
      }

      .loading-hint {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.2);
      }
    }

    .error-slots {
      text-align: center;
      padding: 24px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      color: rgba(255, 255, 255, 0.3);

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: rgba(255, 255, 255, 0.2);
      }

      p {
        margin-top: 12px;
        font-size: 13px;
      }

      .retry-btn {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        background: #c9a96e;
        color: #0a0a0a;
        border: none;
        border-radius: 50px;
        font-size: 12px;
        cursor: pointer;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: #0a0a0a;
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .closed-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.15);
      border-radius: 16px;

      .closed-title {
        color: #fca5a5;
        font-weight: 500;
        font-size: 14px;
      }

      .closed-reason {
        color: rgba(252, 165, 165, 0.7);
        font-size: 12px;
      }
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(80px, 30%), 1fr));
      gap: clamp(4px, 1.5vw, 8px);
    }

    .slot-btn {
      padding: clamp(8px, 2.5vw, 12px) clamp(4px, 1.5vw, 8px);
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;

      .slot-time {
        display: block;
        font-size: clamp(12px, 3.5vw, 14px);
        font-weight: 500;
        margin-bottom: 2px;
      }

      .slot-status {
        display: block;
        font-size: 10px;
      }

      &.available {
        background: rgba(16, 185, 129, 0.1);
        .slot-time { color: #6ee7b7; }
        .slot-status { color: rgba(110, 231, 183, 0.6); }
      }

      &.full {
        background: rgba(239, 68, 68, 0.1);
        .slot-time { color: #fca5a5; text-decoration: line-through; }
        .slot-status { color: rgba(252, 165, 165, 0.6); }
        cursor: not-allowed;
      }

      &.selected {
        background: #c9a96e;
        box-shadow: 0 4px 12px rgba(201, 169, 110, 0.3);
        .slot-time, .slot-status { color: #0a0a0a; text-decoration: none; }
      }
    }

    .guest-counter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 8px;
    }

    .counter-btn {
      width: clamp(40px, 12vw, 48px);
      height: clamp(40px, 12vw, 48px);
      border: none;
      background: transparent;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.3);
      cursor: pointer;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &:active:not(:disabled) {
        color: #c9a96e;
      }
    }

    .guest-count {
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    textarea {
      width: 100%;
      padding: clamp(12px, 3vw, 16px);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      resize: none;
      font-family: inherit;
      outline: none;

      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }

      &:focus {
        border-color: rgba(201, 169, 110, 0.3);
        box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.1);
      }
    }

    .price-section {
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .price-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 4px;
    }

    .price-value {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.5);
    }

    .price-total {
      text-align: right;
    }

    .total-value {
      font-size: clamp(20px, 6vw, 24px);
      font-weight: 300;
      color: #c9a96e;
    }

    .submit-btn {
      width: 100%;
      padding: clamp(16px, 4vw, 20px);
      background: linear-gradient(135deg, #c9a96e, #dfc598);
      color: #0a0a0a;
      border: none;
      border-radius: 16px;
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.4em;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(201, 169, 110, 0.25);
      margin-top: 8px;

      &:active:not(:disabled) {
        box-shadow: 0 14px 40px rgba(201, 169, 110, 0.4);
      }

      &:disabled {
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.25);
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    .success-screen {
      text-align: center;
      padding: 80px 24px;

      .success-divider {
        width: 40px;
        height: 1px;
        background: #c9a96e;
        margin: 0 auto 40px;
      }

      h2 {
        font-size: 20px;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 24px;
      }

      .success-summary {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        line-height: 2;

        b {
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .back-btn {
        margin-top: 48px;
        background: transparent;
        border: none;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        padding-bottom: 4px;
        border-bottom: 1px solid transparent;

        &:hover {
          color: #c9a96e;
          border-bottom-color: #c9a96e;
        }
      }
    }

    @media (orientation: landscape) and (max-height: 500px) {
      .reservation-page {
        padding: 16px 24px 80px;
        margin: 8px;
        border-radius: 20px;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .res-header {
        margin-bottom: 16px;

        h1 {
          font-size: 22px;
        }

        .divider {
          margin: 10px auto;
        }
      }

      .user-bar {
        margin-bottom: 16px;
      }

      section {
        margin-bottom: 16px;
      }

      .calendar-grid {
        padding: 12px;
      }

      .cal-day {
        font-size: 11px;
        border-radius: 8px;
      }

      .legend {
        margin-top: 10px;
      }

      .selected-date-display {
        padding: 10px;
        margin-top: 10px;
        font-size: 12px;
      }

      .slots-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
      }

      .slot-btn {
        padding: 8px 6px;

        .slot-time {
          font-size: 12px;
        }

        .slot-status {
          font-size: 9px;
        }
      }

      .guest-counter {
        max-width: 250px;
      }

      .counter-btn {
        width: 40px;
        height: 40px;
      }

      textarea {
        padding: 12px;
        font-size: 13px;
      }

      .total-value {
        font-size: 20px;
      }

      .submit-btn {
        padding: 16px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        display: block;
      }

      .success-screen {
        padding: 40px 24px;
      }
    }

    @media (min-width: 768px) {
      .reservation-page {
        max-width: 600px;
        margin: 16px auto;
        padding: 40px 40px 120px;
      }

      .res-header h1 {
        font-size: 32px;
      }

      .calendar-grid {
        padding: 20px;
      }

      .cal-day {
        font-size: 14px;
      }

      .slots-grid {
        grid-template-columns: repeat(4, 1fr);
      }

      .slot-btn {
        padding: 14px 10px;
      }

      .guest-counter {
        max-width: 300px;
      }

      textarea {
        padding: 18px;
      }

      .total-value {
        font-size: 28px;
      }

      .submit-btn {
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        display: block;
        padding: 22px;
      }

      .success-screen {
        padding: 100px 40px;
      }
    }

    @media (min-width: 1024px) {
      .reservation-page {
        max-width: 680px;
        padding: 48px 48px 120px;
      }

      .res-header h1 {
        font-size: 36px;
      }

      .slots-grid {
        grid-template-columns: repeat(5, 1fr);
      }

      .cal-day {
        font-size: 15px;
        border-radius: 12px;
      }
    }
  `]
})
export class ReservationComponent implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private location = inject(Location);
  readonly i18n = inject(I18nService);

  // Calendar
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  calendarDays: CalendarDay[] = [];

  today = new Date();
  maxDate = new Date(2026, 11, 31);

  // State
  selectedDate: string | null = null;
  selectedSlot: string | null = null;
  slots: TimeSlot[] = [];
  loadingSlots = false;
  slotsError = false;
  isClosed = false;
  closedReason = '';
  guests = 2;
  notes = '';
  loading = false;
  success = false;
  successMessage = '';

  get canGoPrev(): boolean {
    return this.currentYear > this.today.getFullYear() ||
           (this.currentYear === this.today.getFullYear() && this.currentMonth > this.today.getMonth());
  }

  get canGoNext(): boolean {
    return this.currentYear < 2026 || (this.currentYear === 2026 && this.currentMonth < 11);
  }

  get canSubmit(): boolean {
    return !!this.selectedDate && !!this.selectedSlot;
  }

  ngOnInit() {
    this.today.setHours(0, 0, 0, 0);
    this.buildCalendar();

    // Auto-select today
    const todayStr = this.formatDate(this.today);
    this.selectedDate = todayStr;

    if (!this.authService.currentUser) {
      // Show auth dialog immediately — no data loading until authenticated
      this.showAuthDialog();
    } else {
      // Already logged in — load data right away
      this.loadSlots(todayStr);
      setTimeout(() => this.loadMonthAvailability(), 2000);
    }
  }

  showAuthDialog() {
    const isMobile = window.innerWidth < 768;
    this.dialog.open(AuthDialogComponent, {
      maxWidth: isMobile ? '100vw' : '480px',
      maxHeight: isMobile ? '100vh' : '90vh',
      width: isMobile ? '100%' : '480px',
      height: isMobile ? '100%' : 'auto',
      panelClass: isMobile ? 'fullscreen-dialog' : '',
      disableClose: false
    }).afterClosed().subscribe(result => {
      if (result === true) {
        // Successful login — now load reservation data
        const todayStr = this.formatDate(this.today);
        this.selectedDate = todayStr;
        this.loadSlots(todayStr);
        setTimeout(() => this.loadMonthAvailability(), 2000);
      } else {
        // Dismissed without login — navigate back
        this.location.back();
      }
      this.cdr.detectChanges();
    });
  }

  prevMonth() {
    if (!this.canGoPrev) return;
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.buildCalendar();
    this.loadMonthAvailability();
  }

  nextMonth() {
    if (!this.canGoNext) return;
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.buildCalendar();
    this.loadMonthAvailability();
  }

  buildCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Empty cells
    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push({
        date: new Date(),
        day: 0,
        dateStr: '',
        status: 'disabled',
        isToday: false,
        isSelected: false
      });
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const dateStr = this.formatDate(date);
      const isPast = date < this.today;
      const isToday = date.toDateString() === this.today.toDateString();

      this.calendarDays.push({
        date,
        day,
        dateStr,
        status: isPast ? 'past' : 'available',
        isToday,
        isSelected: this.selectedDate === dateStr
      });
    }
  }

  loadMonthAvailability() {
    // Use calendar endpoint to get all days at once instead of individual requests
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = this.formatDate(firstDay);
    const endDate = this.formatDate(lastDay);

    this.apiService.getCalendarStatus(startDate, endDate).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          if (!data || data.length === 0) return;

          data.forEach((dayData: any) => {
            const day = this.calendarDays.find(d => d.dateStr === dayData.date);
            if (!day || day.status === 'disabled' || day.status === 'past') return;

            if (dayData.isClosed) {
              day.status = 'closed';
            } else if (dayData.availableSlots === 0) {
              day.status = 'full';
            } else if (dayData.availableSlots < dayData.totalSlots / 2) {
              day.status = 'limited';
            } else {
              day.status = 'available';
            }
          });
          this.cdr.detectChanges();
        });
      },
      error: () => {
        // Silently fail - days will remain as 'available'
      }
    });
  }

  selectDate(day: CalendarDay) {
    if (day.status === 'disabled' || day.status === 'past' || day.status === 'closed' || day.status === 'full') {
      return;
    }

    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
    this.selectedDate = day.dateStr;
    this.selectedSlot = null;
    this.loadSlots(day.dateStr);
  }

  loadSlots(dateStr: string) {
    this.loadingSlots = true;
    this.slotsError = false;
    this.isClosed = false;
    this.slots = [];
    this.cdr.detectChanges();

    this.apiService.getAvailableSlots(dateStr).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.loadingSlots = false;
          this.slotsError = false;
          if (data.isClosed) {
            this.isClosed = true;
            this.closedReason = data.reason || '';
          } else {
            this.slots = data.allSlots || data.slots || [];
          }
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.loadingSlots = false;
          this.slotsError = true;
          this.cdr.detectChanges();
        });
      }
    });
  }

  selectSlot(time: string) {
    this.selectedSlot = time;
  }

  updateGuests(delta: number) {
    const newValue = this.guests + delta;
    if (newValue >= 1 && newValue <= 8) {
      this.guests = newValue;
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatSelectedDate(): string {
    if (!this.selectedDate) return '';
    const t = this.i18n.t().reservation;
    const date = new Date(this.selectedDate + 'T12:00:00');
    const dayName = t.dayNames[date.getDay()];
    const day = date.getDate();
    const month = t.monthNamesGenitive[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day}. ${month} ${year}`;
  }

  logout() {
    this.authService.logout().subscribe();
  }

  submitReservation() {
    if (!this.authService.currentUser) {
      const isMobile = window.innerWidth < 768;
      this.dialog.open(AuthDialogComponent, {
        maxWidth: isMobile ? '100vw' : '480px',
        maxHeight: isMobile ? '100vh' : '90vh',
        width: isMobile ? '100%' : '480px',
        height: isMobile ? '100%' : 'auto',
        panelClass: isMobile ? 'fullscreen-dialog' : ''
      }).afterClosed().subscribe(result => {
        if (result) {
          this.submitReservation();
        }
      });
      return;
    }

    if (!this.selectedDate || !this.selectedSlot) return;

    this.loading = true;

    const reservation: ReservationRequest = {
      date: this.selectedDate,
      time: this.selectedSlot,
      guests: this.guests,
      specialRequests: this.notes || undefined
    };

    this.apiService.createReservation(reservation).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;

        const t = this.i18n.t().reservation;
        const date = new Date(this.selectedDate + 'T12:00:00');
        const dayName = t.dayNames[date.getDay()];
        const day = date.getDate();
        const month = t.monthNamesGenitive[date.getMonth()];
        const year = date.getFullYear();
        const total = (this.guests * 95).toFixed(2).replace('.', ',');
        const personWord = this.guests === 1 ? t.person1 : this.guests < 5 ? t.person24 : t.person5plus;

        this.successMessage = `
          ${t.successFor} <b>${this.guests} ${personWord}</b> ${t.successReceived}<br><br>
          <span style="color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.2em;font-size:10px">${t.dateLabel}</span><br>
          <b>${dayName}, ${day}. ${month} ${year}</b><br><br>
          <span style="color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.2em;font-size:10px">${t.timeLabel}</span><br>
          <b>${this.selectedSlot}</b><br><br>
          <span style="color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.2em;font-size:10px">${t.totalAmountLabel}</span><br>
          <span style="font-size:16px;color:#c9a96e">${total} €</span><br><br>
          <span style="color:rgba(255,255,255,0.3);font-size:9px">${t.confirmSentTo} ${this.authService.currentUser?.email}</span>
        `;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.error || this.i18n.t().reservation.reservationError, 'OK', { duration: 3000 });
      }
    });
  }
}
