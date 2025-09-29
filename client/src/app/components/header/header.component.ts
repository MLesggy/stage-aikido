
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/authentication';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router, public authService: AuthService){}

  navigateTo(path: string){
    this.router.navigateByUrl(`${path}`);
  }
}