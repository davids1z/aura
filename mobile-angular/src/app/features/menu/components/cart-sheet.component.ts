import { Component, inject, ElementRef, AfterViewInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
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
      background: white;
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
      min-height: 75vh;
      max-height: 92vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.12);
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
      background: #d6d3d1;
    }

    .sheet-title {
      text-align: center;
      padding: 0 20px 20px;

      h2 {
        font-size: 18px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: #1C1917;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #a8a29e;
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
        background: #f5f5f4;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: #d6d3d1;
        }
      }

      p {
        color: #a8a29e;
        font-size: 14px;
      }
    }

    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 0 20px;
      max-height: 55vh;
      touch-action: pan-y;
      overscroll-behavior: contain;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f5f5f4;
      border-radius: 16px;
      margin-bottom: 12px;
    }

    .item-info {
      flex: 1;
      min-width: 0;

      h4 {
        font-size: 14px;
        font-weight: 500;
        color: #1C1917;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        font-size: 13px;
        color: #a8a29e;
      }
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      border: none;
      font-size: 18px;
      color: #78716c;
      cursor: pointer;

      &:active {
        background: #e5e5e5;
      }
    }

    .qty {
      font-size: 14px;
      font-weight: 600;
      color: #1C1917;
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
      color: #a8a29e;
      cursor: pointer;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      &:active {
        color: #ef4444;
        background: #fef2f2;
      }
    }

    .cart-footer {
      padding: 20px;
      border-top: 1px solid #f5f5f4;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      span {
        color: #78716c;
        font-size: 14px;
      }

      .total-price {
        font-size: 24px;
        font-weight: 500;
        color: #1C1917;
      }
    }

    .checkout-btn {
      width: 100%;
      padding: 18px;
      background: #1C1917;
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      cursor: pointer;

      &:active {
        background: #292524;
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
        background: #292524;
      }

      .qty-btn:hover {
        background: #e5e5e5;
      }

      .remove-btn:hover {
        color: #ef4444;
        background: #fef2f2;
      }
    }
  `]
})
export class CartSheetComponent {
  cartService = inject(CartService);
  readonly i18n = inject(I18nService);
  private bottomSheetRef = inject(MatBottomSheetRef<CartSheetComponent>);
  private dialog = inject(MatDialog);

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
