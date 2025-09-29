import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }
  

  shouldShowHeaderFooter(): boolean {
    // Les pages dashboard utilisent le MainLayoutComponent
    if (this.currentRoute.includes('/dashboard')) {
      return false;
    }
    
    // Les autres routes sans header/footer
    const routesWithoutHeaderFooter = ['/login', '/change-email', '/change-password'];
    return !routesWithoutHeaderFooter.some(route => this.currentRoute.includes(route));
  }
}
