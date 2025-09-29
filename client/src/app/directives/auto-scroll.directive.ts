import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAutoScroll]'
})
export class AutoScrollDirective {
  @Input() scrollDelay = 100;
  @Input() scrollMargin = 20;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    setTimeout(() => {
      const element = this.el.nativeElement;
      const rect = element.getBoundingClientRect();
      
      if (rect.bottom > window.innerHeight || rect.top < 0) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, this.scrollDelay);
  }
}