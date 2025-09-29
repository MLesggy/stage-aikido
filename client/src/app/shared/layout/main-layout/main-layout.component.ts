// main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Seminar } from '../../../models/seminars/seminars.models';
import { SeminarsService } from '../../../services/seminars/seminars.service';
import { AuthService } from '../../../services/auth-service/authentication';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  currentRoute: string = '';
  seminars!: Seminar[];
  currentMonth: number = new Date().getMonth();

  constructor(private router: Router, public seminarsService: SeminarsService, public authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  ngOnInit(): void {
    this.hydratation();
  }

  hydratation() {
    this.seminarsService.getSeminarsWithoutImages().subscribe((seminarsData: any) => {
      if (Array.isArray(seminarsData)) {
        this.seminars = seminarsData.map((seminarData: any) => {
          return Object.assign(new Seminar(), seminarData);
        });
      } else {
        this.seminars = [Object.assign(new Seminar(), seminarsData)];
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(`${path}`);
  }
}
