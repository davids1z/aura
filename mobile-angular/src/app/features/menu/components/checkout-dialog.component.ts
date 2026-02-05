import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../core/services/cart.service';
import { ApiService } from '../../../core/services/api.service';
import { I18nService } from '../../../core/services/i18n.service';
import { GuestOrderRequest } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatInputModule, MatFormFieldModule, MatSnackBarModule
  ],
  template: `
    <div class="checkout-dialog">
      @if (!success) {
        <!-- Header -->
        <div class="dialog-header">
          <button class="back-btn" (click)="close()">
            <mat-icon>arrow_back</mat-icon>
          </button>
        </div>

        <!-- Title -->
        <div class="dialog-title">
          <h2>{{ i18n.t().checkout.title }}</h2>
          <p>{{ i18n.t().checkout.subtitle }}</p>
        </div>

        <!-- Form -->
        <form class="checkout-form" (ngSubmit)="submitOrder()">
          <input type="text" [(ngModel)]="firstName" name="firstName"
                 [placeholder]="i18n.t().checkout.firstName" required class="form-input">

          <input type="text" [(ngModel)]="lastName" name="lastName"
                 [placeholder]="i18n.t().checkout.lastName" required class="form-input">

          <input type="tel" [(ngModel)]="phone" name="phone"
                 [placeholder]="i18n.t().checkout.phone" required class="form-input">

          <input type="text" [(ngModel)]="address" name="address"
                 [placeholder]="i18n.t().checkout.deliveryAddress" required class="form-input">

          <textarea [(ngModel)]="notes" name="notes" rows="2"
                    [placeholder]="i18n.t().checkout.noteOptional" class="form-input"></textarea>

          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-header">
              <span>{{ i18n.t().menu.yourOrder }}</span>
              <span>{{ (cartService.totalItems$ | async) }} {{ i18n.t().menu.items }}</span>
            </div>
            <div class="summary-items">
              @for (item of cartService.cartItems$ | async; track item.id) {
                <div class="summary-item">
                  <span>{{ item.quantity }}× {{ i18n.getItemName(item.id, item.name) }}</span>
                  <span>{{ (item.price * item.quantity).toFixed(2) }} €</span>
                </div>
              }
            </div>
            <div class="summary-total">
              <span>{{ i18n.t().menu.total }}</span>
              <span class="total">{{ (cartService.totalPrice$ | async)?.toFixed(2) }} €</span>
            </div>
          </div>

          @if (error) {
            <div class="error-message">{{ error }}</div>
          }

          <button type="submit" class="submit-btn" [disabled]="loading">
            {{ loading ? i18n.t().checkout.sending : i18n.t().checkout.confirmOrder }}
          </button>
        </form>
      }

      @if (success) {
        <!-- Success State -->
        <div class="success-state">
          <div class="success-icon">
            <mat-icon>check</mat-icon>
          </div>
          <h3>{{ i18n.t().checkout.thankYou }}</h3>
          <p>{{ i18n.t().checkout.successMessage }}</p>
          <button class="ok-btn" (click)="close()">{{ i18n.t().common.ok }}</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-dialog {
      background: rgba(15, 15, 15, 0.95);
      min-height: 100vh;
      padding: clamp(12px, 4vw, 20px);
      padding-bottom: clamp(24px, 8vw, 40px);
    }

    .dialog-header {
      margin-bottom: 16px;
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

    .dialog-title {
      text-align: center;
      margin-bottom: clamp(16px, 5vw, 24px);

      h2 {
        font-size: clamp(16px, 4.5vw, 18px);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-input {
      width: 100%;
      padding: clamp(12px, 4vw, 16px) clamp(14px, 4.5vw, 20px);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: clamp(12px, 4vw, 16px);
      font-size: clamp(13px, 3.8vw, 14px);
      color: rgba(255, 255, 255, 0.9);
      outline: none;
      font-family: inherit;
      resize: none;

      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }

      &:focus {
        border-color: rgba(201, 169, 110, 0.3);
        box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.1);
      }
    }

    .order-summary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: clamp(12px, 4vw, 16px);
      padding: clamp(12px, 3.5vw, 16px);
      margin-top: 8px;
    }

    .summary-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 12px;
    }

    .summary-items {
      max-height: clamp(80px, 25vw, 120px);
      overflow-y: auto;
      margin-bottom: 12px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 6px;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 14px;

      span {
        color: rgba(255, 255, 255, 0.4);
      }

      .total {
        font-size: 18px;
        font-weight: 500;
        color: #c9a96e;
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
      border-radius: clamp(12px, 4vw, 16px);
      font-size: clamp(10px, 3vw, 12px);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.2em;
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

    .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      text-align: center;
      padding: clamp(24px, 8vw, 40px) clamp(12px, 4vw, 20px);
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(201, 169, 110, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #c9a96e;
      }
    }

    h3 {
      font-size: 18px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 12px;
    }

    .success-state p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.4);
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .ok-btn {
      width: 100%;
      max-width: 300px;
      padding: clamp(14px, 4.5vw, 18px);
      background: linear-gradient(135deg, #c9a96e, #dfc598);
      color: #0a0a0a;
      border: none;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(201, 169, 110, 0.2);
    }

    @media (min-width: 768px) {
      .checkout-dialog {
        min-height: auto;
        padding: 32px;
        max-width: 480px;
        margin: 0 auto;
      }

      .dialog-title h2 {
        font-size: 20px;
      }

      .submit-btn:hover:not(:disabled) {
        box-shadow: 0 14px 40px rgba(201, 169, 110, 0.35);
      }

      .ok-btn:hover {
        box-shadow: 0 14px 40px rgba(201, 169, 110, 0.35);
      }
    }
  `]
})
export class CheckoutDialogComponent {
  cartService = inject(CartService);
  readonly i18n = inject(I18nService);
  private apiService = inject(ApiService);
  private dialogRef = inject(MatDialogRef<CheckoutDialogComponent>);
  private snackBar = inject(MatSnackBar);

  firstName = '';
  lastName = '';
  phone = '';
  address = '';
  notes = '';
  error = '';
  loading = false;
  success = false;

  close() {
    this.dialogRef.close();
  }

  submitOrder() {
    if (!this.firstName || !this.lastName || !this.phone || !this.address) {
      this.error = this.i18n.t().checkout.fillRequired;
      return;
    }

    this.loading = true;
    this.error = '';

    const order: GuestOrderRequest = {
      customerName: `${this.firstName} ${this.lastName}`,
      phone: this.phone,
      deliveryAddress: this.address,
      notes: this.notes,
      items: this.cartService.cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }))
    };

    this.apiService.createGuestOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || this.i18n.t().checkout.orderError;
      }
    });
  }
}
