import { Component, inject, ElementRef, AfterViewInit, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CartService } from '../../../core/services/cart.service';
import { I18nService } from '../../../core/services/i18n.service';
import { CheckoutDialogComponent } from './checkout-dialog.component';

@Component({
  selector: 'app-cart-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="cart-sheet" #sheet [style.transform]="'translateY(' + dragOffset + 'px)'"
         [style.transition]="dragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)'">
      <!-- Drag Handle -->
      <div class="drag-zone"
           (touchstart)="onDragStart($event)"
           (touchmove)="onDragMove($event)"
           (touchend)="onDragEnd($event)">
        <div class="drag-handle-area">
          <div class="drag-handle"></div>
        </div>

        <!-- Title -->
        <div class="sheet-title">
          <h2>{{ i18n.t().menu.cart }}</h2>
          <p>{{ (cartService.totalItems$ | async) || 0 }} {{ i18n.t().menu.items }}</p>
        </div>
      </div>

      <!-- Empty State -->
      @if ((cartService.cartItems$ | async)?.length === 0) {
        <div class="empty-state"
             (touchstart)="onDragStart($event)"
             (touchmove)="onDragMove($event)"
             (touchend)="onDragEnd($event)">
          <div class="empty-icon">
            <mat-icon>shopping_bag</mat-icon>
          </div>
          <p>{{ i18n.t().menu.emptyCart }}</p>
        </div>
      }

      <!-- Cart Items -->
      @if ((cartService.cartItems$ | async)?.length ?? 0 > 0) {
        <div class="cart-items">
          @for (item of cartService.cartItems$ | async; track item.id) {
            <div class="cart-item">
              <div class="item-info">
                <h4>{{ i18n.getItemName(item.id, item.name) }}</h4>
                <p>{{ item.price.toFixed(2) }} €</p>
              </div>
              <div class="item-controls">
                <button class="qty-btn" (click)="updateQuantity(item.id, -1)">−</button>
                <span class="qty">{{ item.quantity }}</span>
                <button class="qty-btn" (click)="updateQuantity(item.id, 1)">+</button>
              </div>
              <button class="remove-btn" (click)="removeItem(item.id)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="cart-footer">
          <div class="total-row">
            <span>{{ i18n.t().menu.total }}</span>
            <span class="total-price">{{ (cartService.totalPrice$ | async)?.toFixed(2) }} €</span>
          </div>
          <button class="checkout-btn" (click)="checkout()">
            {{ i18n.t().menu.continueToOrder }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-sheet {
      background: #0a0a0a;
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
      min-height: 75vh;
      max-height: 92vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
      overscroll-behavior: none;
      will-change: transform;
    }

    .drag-zone {
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    .drag-handle-area {
      display: flex;
      justify-content: center;
      padding: 12px 0 8px;
      cursor: grab;
    }

    .drag-handle {
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.15);
    }

    .sheet-title {
      text-align: center;
      padding: 0 clamp(12px, 4vw, 20px) 20px;

      h2 {
        font-size: 18px;
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

    .empty-state {
      padding: 48px 20px;
      text-align: center;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;

      .empty-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: rgba(255, 255, 255, 0.2);
        }
      }

      p {
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
      }
    }

    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 0 clamp(12px, 4vw, 20px);
      max-height: 55vh;
      touch-action: pan-y;
      overscroll-behavior: contain;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: clamp(8px, 3vw, 12px);
      padding: clamp(12px, 3.5vw, 16px);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: clamp(12px, 4vw, 16px);
      margin-bottom: clamp(8px, 3vw, 12px);
    }

    .item-info {
      flex: 1;
      min-width: 0;

      h4 {
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .qty-btn {
      width: clamp(28px, 8vw, 32px);
      height: clamp(28px, 8vw, 32px);
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: none;
      font-size: clamp(16px, 4.5vw, 18px);
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;

      &:active {
        background: rgba(255, 255, 255, 0.12);
        color: #c9a96e;
      }
    }

    .qty {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      min-width: 24px;
      text-align: center;
    }

    .remove-btn {
      width: 32px;
      height: 32px;
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

      &:active {
        color: #fca5a5;
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .cart-footer {
      padding: clamp(12px, 4vw, 20px);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      span {
        color: rgba(255, 255, 255, 0.4);
        font-size: 14px;
      }

      .total-price {
        font-size: clamp(20px, 6vw, 24px);
        font-weight: 500;
        color: #c9a96e;
      }
    }

    .checkout-btn {
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
      box-shadow: 0 8px 24px rgba(201, 169, 110, 0.2);

      &:active {
        box-shadow: 0 12px 30px rgba(201, 169, 110, 0.35);
      }
    }

    @media (min-width: 768px) {
      .cart-sheet {
        max-width: 480px;
        margin: 0 auto;
        border-radius: 32px 32px 0 0;
        min-height: 60vh;
      }

      .checkout-btn:hover {
        box-shadow: 0 14px 40px rgba(201, 169, 110, 0.35);
      }

      .qty-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #c9a96e;
      }

      .remove-btn:hover {
        color: #fca5a5;
        background: rgba(239, 68, 68, 0.1);
      }
    }
  `]
})
export class CartSheetComponent {
  cartService = inject(CartService);
  readonly i18n = inject(I18nService);
  private bottomSheetRef = inject(MatBottomSheetRef<CartSheetComponent>);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.i18n.language();
      this.cdr.detectChanges();
    });
  }

  dragOffset = 0;
  dragging = false;
  private startY = 0;
  private lastY = 0;
  private lastTime = 0;
  private velocity = 0;

  onDragStart(e: TouchEvent) {
    this.dragging = true;
    this.startY = e.touches[0].clientY;
    this.lastY = this.startY;
    this.lastTime = Date.now();
    this.velocity = 0;
  }

  onDragMove(e: TouchEvent) {
    if (!this.dragging) return;
    e.preventDefault();

    const currentY = e.touches[0].clientY;
    const now = Date.now();
    const dt = now - this.lastTime;

    if (dt > 0) {
      this.velocity = (currentY - this.lastY) / dt * 1000;
    }

    this.lastY = currentY;
    this.lastTime = now;

    const delta = currentY - this.startY;
    // Only allow dragging down (positive delta), add resistance for dragging up
    this.dragOffset = delta > 0 ? delta : delta * 0.2;
  }

  onDragEnd(e: TouchEvent) {
    if (!this.dragging) return;
    this.dragging = false;

    const threshold = window.innerHeight * 0.2;

    if (this.dragOffset > threshold || this.velocity > 500) {
      // Dismiss: slide all the way down
      this.dragOffset = window.innerHeight;
      setTimeout(() => this.bottomSheetRef.dismiss(), 300);
    } else {
      // Bounce back
      this.dragOffset = 0;
    }
  }

  updateQuantity(id: number, delta: number) {
    this.cartService.updateQuantity(id, delta);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  checkout() {
    this.bottomSheetRef.dismiss();
    const isMobile = window.innerWidth < 768;
    this.dialog.open(CheckoutDialogComponent, {
      maxWidth: isMobile ? '100vw' : '480px',
      maxHeight: isMobile ? '100vh' : '90vh',
      width: isMobile ? '100%' : '480px',
      height: isMobile ? '100%' : 'auto',
      panelClass: isMobile ? 'fullscreen-dialog' : ''
    });
  }
}
