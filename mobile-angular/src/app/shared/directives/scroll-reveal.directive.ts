import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollRevealState {
  skipAnimations = false;
}

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private state: ScrollRevealState
  ) {}

  ngOnInit() {
    const element = this.el.nativeElement;

    if (this.state.skipAnimations) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
    element.style.willChange = 'opacity, transform';

    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                element.style.transition = 'opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                setTimeout(() => {
                  element.style.willChange = 'auto';
                }, 1200);
              }, this.revealDelay);
              this.observer?.disconnect();
            }
          });
        },
        { threshold: 0.05, rootMargin: '-60px 0px' }
      );
      this.observer.observe(element);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
