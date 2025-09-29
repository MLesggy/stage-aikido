import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/users/user.models';
import { shareReplay, tap } from 'rxjs';
import { addHours, isBefore } from 'date-fns';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private periodBetweenCheck: number = 30 * 1000; //time in ms

  constructor(private http: HttpClient, private router: Router) { 
    this.startTokenExpirationCheck(); //start the periodic tokenCheckExpiration function
  }

  //Verify if the user is connected every periodBetweenCheck ms
  private startTokenExpirationCheck() {
    setInterval(() => {
      //if the user got a token (user was connected) && token expired, redirection to login with alert
      if (localStorage.getItem('id_token') && !this.isLoggedIn()) {
        this.logout();
        alert('Votre session a expirée. Veuillez vous reconnecter');
        this.router.navigate(['/login']);
      }
    }, this.periodBetweenCheck);
  }

  login(email: string, password: string): any{
    return this.http.post<User>('https://stage-aikido-production.up.railway.app/api/login/', {email, password}).pipe(
      tap(res=> this.setSession(res)),
      shareReplay(1)
    );
  }

  private setSession(authResult: any) {
    let expiresAt: Date;
    
    if (authResult.expiresIn.includes('s')) {
      // If the token contains 's' it means seconds
      const seconds = parseInt(authResult.expiresIn.replace('s', ''));
      expiresAt = new Date(Date.now() + seconds * 1000);
    } else if (authResult.expiresIn.includes('m')) {
      // Same with minutes
      const minutes = parseInt(authResult.expiresIn.replace('m', ''));
      expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    } else if (authResult.expiresIn.includes('h')) {
      // Same with hours
      const hours = parseInt(authResult.expiresIn.replace('h', ''));
      expiresAt = addHours(new Date(), hours);
    } else {
      // Hours by default
      expiresAt = addHours(new Date(), 1);
    }

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', expiresAt.getTime().toString());
    localStorage.setItem('admin_email', authResult.admin.admin_email);
    localStorage.setItem('admin_id', authResult.admin.admin_id.toString());
  }

  public logout(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_id');
    this.router.navigateByUrl(``);
  }

  public isLoggedIn(){
    return isBefore(new Date(), this.getExpiration());
  }

  isLoggedOut(){
    return !this.isLoggedIn();
  }

  public getExpiration(){
    const expiration = localStorage.getItem('expires_at');
    if (!expiration){
      return new Date(0);
    }
    return new Date(parseInt(expiration));
  }

  //3 step forgotten password
  getResetToken(email: string){
    return this.http.post('https://stage-aikido-production.up.railway.app/api/passwordReset/request', {email});
  }

  verifyResetToken(token: string){
    return this.http.post('https://stage-aikido-production.up.railway.app/api/passwordReset/verify', {token});
  }

  setNewPassword(password: string, token: string){
    return this.http.post('https://stage-aikido-production.up.railway.app/api/passwordReset/reset', {password, token});
  }

  //password modify
  changePassword(oldPassword: string, newPassword: string, email: string){
    return this.http.post('https://stage-aikido-production.up.railway.app/api/passwordChange', {oldPassword, newPassword, email});
  }

  //email modify
  changeEmail(email: string, id: number){
    return this.http.post('https://stage-aikido-production.up.railway.app/api/emailChange', {email, id});
  }
}
