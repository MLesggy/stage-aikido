import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeminarsService } from '../../services/seminars/seminars.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/authentication';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})

export class DashboardHomeComponent {
  adminEmail: string = localStorage.getItem('admin_email') || '';

  constructor(private router: Router, public seminarsService: SeminarsService, public authService: AuthService) {}

  navigateTo(path: string) {
    this.router.navigateByUrl(`${path}`);
  }

  resetPassword() {
    //get the resetToken
    this.authService.getResetToken(this.adminEmail).subscribe((tokenData) => {
      const resetToken = Object.assign(tokenData);
      //verify the resetToken
      this.authService.verifyResetToken(resetToken).subscribe(() => {
        //navigate into change-password
        this.router.navigateByUrl(`/change-password/${resetToken}`);
      })
    });
  }

}
