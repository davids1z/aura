import { Component, OnInit, inject, ChangeDetectorRef, NgZone, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule, MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { I18nService } from '../../core/services/i18n.service';
import { MenuItem, CATEGORY_ORDER, MenuCategory } from '../../core/models/menu-item.model';
import { CartSheetComponent } from './components/cart-sheet.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatIconModule,
    MatBadgeModule, MatBottomSheetModule, MatSnackBarModule, ScrollRevealDirective
  ],
  template: `
    <div class="menu-page">
      <!-- Header -->
      <header class="menu-header" appReveal>
        <p class="label">{{ i18n.t().home.season }}</p>
        <h1>{{ i18n.t().menu.menuTitle }}</h1>
        <div class="divider"></div>
        <p class="subtitle">
          {{ i18n.t().menu.menuSubtitle }}
        </p>
      </header>

      <!-- Featured Image -->
      <div class="featured-image" appReveal [revealDelay]="150">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2070"
             alt="Fine Dining">
        <div class="image-overlay">
          <p class="delivery-label">{{ i18n.t().menu.deliveryAvailable }}</p>
          <p class="delivery-text">{{ i18n.t().menu.deliveryTagline }}</p>
        </div>
      </div>

      <!-- Loading -->
      @if (loading) {
        <div class="loading">
          <mat-icon class="spin">sync</mat-icon>
          <p>{{ i18n.t().menu.loading }}</p>
        </div>
      }

      <!-- Error -->
      @if (error && !loading) {
        <div class="error-state">
          <mat-icon>cloud_off</mat-icon>
          <p>{{ i18n.t().menu.error }}</p>
          <button class="retry-btn" (click)="loadMenu()">
            <mat-icon>refresh</mat-icon>
            {{ i18n.t().menu.retry }}
          </button>
        </div>
      }

      <!-- Menu Items by Category -->
      @for (category of categories; track category) {
        @if (getItemsByCategory(category).length > 0) {
          <section class="category-section" appReveal>
            <div class="category-header">
              <div class="line"></div>
              <span class="diamond"></span>
              <h2>{{ getCategoryName(category) }}</h2>
              <span class="diamond"></span>
              <div class="line"></div>
            </div>

            <div class="menu-items-list">
              @for (item of getItemsByCategory(category); track item.id) {
                <div class="menu-item" [class.has-discount]="hasDiscount(item)">
                  <div class="item-content">
                    <div class="item-header">
                      <div class="item-name">
                        <h3>{{ i18n.getItemName(item.id, item.name) }}</h3>
                        @if (hasDiscount(item)) {
                          <span class="discount-tag">-{{ item.discountPercent }}%</span>
                        }
                      </div>
                      <div class="item-prices">
                        @if (hasDiscount(item)) {
                          <span class="original-price">{{ item.price.toFixed(2) }} €</span>
                          <span class="sale-price">{{ getEffectivePrice(item).toFixed(2) }} €</span>
                        } @else {
                          <span class="price">{{ item.price.toFixed(2) }} €</span>
                        }
                      </div>
                    </div>
                    <p class="item-description">{{ i18n.getItemDescription(item.id, item.description) }}</p>
                    <button class="add-button" [class.discount-btn]="hasDiscount(item)" (click)="addToCart(item)">
                      <mat-icon>add</mat-icon>
                      {{ i18n.t().menu.addToCart }}
                    </button>
                  </div>
                  @if (item.imageUrl) {
                    <div class="item-image">
                      <img [src]="item.imageUrl" [alt]="item.name">
                      @if (hasDiscount(item)) {
                        <span class="image-badge">-{{ item.discountPercent }}%</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </section>
        }
      }

      <!-- Floating Cart Button -->
      <button class="cart-fab" (click)="openCart()" [class.has-items]="(cartService.totalItems$ | async) ?? 0 > 0">
        <mat-icon>shopping_bag</mat-icon>
        @if ((cartService.totalItems$ | async) ?? 0 > 0) {
          <span class="cart-badge">{{ cartService.totalItems$ | async }}</span>
        }
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #0a0a0a;
    }

    .menu-page {
      background: #0a0a0a;
      min-height: 100vh;
      padding-bottom: 100px;
    }

    .menu-header {
      text-align: center;
      padding: clamp(20px, 6vw, 32px) clamp(12px, 4vw, 24px);
    }

    .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5em;
      color: rgba(201, 169, 110, 0.7);
      margin-bottom: 12px;
    }

    h1 {
      font-size: clamp(24px, 7vw, 32px);
      font-weight: 400;
      font-style: italic;
      color: rgba(255, 255, 255, 0.9);
      font-family: 'Playfair Display', serif;
    }

    .divider {
      width: 80px;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(201, 169, 110, 0.5), transparent);
      margin: 24px auto;
    }

    .subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 300;
      line-height: 1.6;
      max-width: 300px;
      margin: 0 auto;
    }

    .featured-image {
      position: relative;
      margin: 0 clamp(12px, 4vw, 24px) clamp(20px, 6vw, 32px);
      border-radius: 24px;
      overflow: hidden;
      height: 200px;
      box-shadow: 0 20px 40px rgba(201, 169, 110, 0.12);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        color: white;
      }

      .delivery-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        opacity: 0.8;
        margin-bottom: 4px;
      }

      .delivery-text {
        font-size: 18px;
        font-style: italic;
        font-family: 'Playfair Display', serif;
      }
    }

    .loading {
      text-align: center;
      padding: 48px;
      color: rgba(255, 255, 255, 0.3);

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      p {
        margin-top: 12px;
        font-size: 14px;
      }

      .loading-hint {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.2);
        margin-top: 8px;
      }
    }

    .error-state {
      text-align: center;
      padding: 48px;
      color: rgba(255, 255, 255, 0.3);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: rgba(255, 255, 255, 0.2);
      }

      p {
        margin-top: 16px;
        font-size: 14px;
      }

      .retry-btn {
        margin-top: 16px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: #c9a96e;
        color: #0a0a0a;
        border: none;
        border-radius: 50px;
        font-size: 13px;
        cursor: pointer;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #0a0a0a;
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .category-section {
      padding: 0 clamp(12px, 4vw, 24px) clamp(20px, 6vw, 32px);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;

      .line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08));

        &:last-child {
          background: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.08));
        }
      }

      .diamond {
        width: 5px;
        height: 5px;
        background: rgba(201, 169, 110, 0.3);
        transform: rotate(45deg);
        flex-shrink: 0;
      }

      h2 {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.4em;
        color: #c9a96e;
        font-weight: 400;
        white-space: nowrap;
      }
    }

    .menu-items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .menu-item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: clamp(12px, 3.5vw, 20px);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      transition: border-color 0.2s ease;

      &.has-discount {
        background: rgba(34, 197, 94, 0.06);
        border-color: rgba(110, 231, 183, 0.1);
      }
    }

    .item-content {
      flex: 1;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .item-name {
      display: flex;
      align-items: center;
      gap: 8px;

      h3 {
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Playfair Display', serif;
      }
    }

    .discount-tag {
      padding: 2px 8px;
      font-size: 11px;
      background: rgba(34, 197, 94, 0.8);
      color: white;
      border-radius: 50px;
      font-weight: 500;
    }

    .item-prices {
      text-align: right;

      .price {
        font-size: 16px;
        font-weight: 500;
        color: #c9a96e;
      }

      .original-price {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.3);
        text-decoration: line-through;
        display: block;
      }

      .sale-price {
        font-size: 16px;
        color: #6ee7b7;
        font-weight: 500;
        display: block;
      }
    }

    .item-description {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .add-button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      background: transparent;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &:active {
        border-color: #c9a96e;
        color: #c9a96e;
        background: rgba(201, 169, 110, 0.08);
      }

      &.discount-btn {
        border-color: rgba(110, 231, 183, 0.3);
        color: #6ee7b7;

        &:active {
          background: rgba(34, 197, 94, 0.2);
          color: #6ee7b7;
          border-color: #6ee7b7;
        }
      }
    }

    .item-image {
      position: relative;
      width: 100%;
      height: clamp(120px, 40vw, 160px);
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
    }

    .image-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 40px;
      height: 40px;
      background: rgba(34, 197, 94, 0.8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .cart-fab {
      position: fixed;
      bottom: 90px;
      right: clamp(12px, 4vw, 24px);
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #c9a96e;
      color: #0a0a0a;
      border: none;
      box-shadow: 0 8px 24px rgba(201, 169, 110, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 100;
      transition: transform 0.2s ease;

      mat-icon {
        font-size: 24px;
      }

      &:active {
        transform: scale(0.95);
      }

      &.has-items {
        animation: pulse 0.3s ease;
      }
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c9a96e, #dfc598);
      color: #0a0a0a;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(201, 169, 110, 0.4);
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @media (orientation: landscape) and (max-height: 500px) {
      .menu-page {
        padding-bottom: 60px;
      }

      .menu-header {
        padding: 16px 24px;
      }

      h1 {
        font-size: 26px;
      }

      .divider {
        margin: 12px auto;
      }

      .subtitle {
        font-size: 12px;
      }

      .featured-image {
        margin: 0 24px 20px;
        height: 150px;
      }

      .category-section {
        padding: 0 24px 20px;
      }

      .menu-item {
        padding: 12px 0;
      }

      .item-header h3 {
        font-size: 14px;
      }

      .item-description {
        font-size: 12px;
        margin-bottom: 8px;
      }

      .item-image {
        height: 120px;
      }

      .cart-fab {
        bottom: 60px;
        width: 48px;
        height: 48px;

        mat-icon {
          font-size: 20px;
        }
      }
    }

    @media (min-width: 768px) {
      .menu-header {
        padding: 48px 48px 32px;
      }

      h1 {
        font-size: 40px;
      }

      .subtitle {
        font-size: 15px;
        max-width: 420px;
      }

      .featured-image {
        margin: 0 48px 40px;
        height: 280px;
      }

      .category-section {
        padding: 0 48px 40px;
      }

      .menu-item {
        flex-direction: row;
        padding: 24px;

        &:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
        }
      }

      .item-header h3 {
        font-size: 17px;
      }

      .item-image {
        width: 140px;
        height: 110px;
        flex-shrink: 0;
      }

      .add-button {
        &:hover {
          border-color: #c9a96e;
          color: #c9a96e;
          background: rgba(201, 169, 110, 0.08);
        }

        &.discount-btn:hover {
          background: rgba(34, 197, 94, 0.2);
          color: #6ee7b7;
          border-color: #6ee7b7;
        }
      }
    }

    @media (min-width: 1024px) {
      .menu-header {
        padding: 56px 64px 40px;
      }

      h1 {
        font-size: 44px;
      }

      .subtitle {
        max-width: 500px;
        font-size: 16px;
      }

      .featured-image {
        margin: 0 64px 48px;
        height: 340px;
        border-radius: 32px;
      }

      .category-section {
        padding: 0 64px 48px;
      }

      .item-header h3 {
        font-size: 18px;
      }

      .item-image {
        width: 160px;
        height: 120px;
        border-radius: 16px;
      }
    }
  `]
})
export class MenuComponent implements OnInit {
  private apiService = inject(ApiService);
  cartService = inject(CartService);
  private bottomSheet = inject(MatBottomSheet);
  private overlay = inject(Overlay);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  readonly i18n = inject(I18nService);

  menuItems: MenuItem[] = [];
  categories = CATEGORY_ORDER;
  loading = true;
  error = false;

  constructor() {
    // Force re-render when language changes
    effect(() => {
      this.i18n.language();
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.loading = true;
    this.error = false;
    this.cdr.detectChanges();

    this.apiService.getMenuItems().subscribe({
      next: (items) => {
        this.ngZone.run(() => {
          this.menuItems = items;
          this.loading = false;
          this.error = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getItemsByCategory(category: MenuCategory): MenuItem[] {
    return this.menuItems.filter(item => item.category === category);
  }

  getCategoryName(category: MenuCategory): string {
    const categories = this.i18n.t().menu.categories;
    const categoryMap: Record<string, string> = {
      'Appetizer': categories.appetizer,
      'Soup': categories.soup,
      'Salad': categories.salad,
      'Pasta': categories.pasta,
      'Fish': categories.fish,
      'Meat': categories.meat,
      'Dessert': categories.dessert,
      'Beverage': categories.beverage,
      'Special': categories.special,
    };
    return categoryMap[category] || category;
  }

  hasDiscount(item: MenuItem): boolean {
    return !!item.discountPercent && item.discountPercent > 0 &&
      (!item.discountEndDate || new Date(item.discountEndDate) > new Date());
  }

  getEffectivePrice(item: MenuItem): number {
    if (this.hasDiscount(item)) {
      return item.price * (1 - item.discountPercent! / 100);
    }
    return item.price;
  }

  addToCart(item: MenuItem) {
    const cartItem = this.hasDiscount(item)
      ? { ...item, price: this.getEffectivePrice(item) }
      : item;
    this.cartService.addToCart(cartItem);
    this.snackBar.open(`${this.i18n.getItemName(item.id, item.name)} ✓`, '', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'success-snackbar'
    });
  }

  openCart() {
    document.body.style.overflow = 'hidden';
    const ref = this.bottomSheet.open(CartSheetComponent, {
      backdropClass: 'cart-sheet-backdrop',
      panelClass: 'cart-sheet-container',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    ref.afterDismissed().subscribe(() => {
      document.body.style.overflow = '';
    });
  }
}
