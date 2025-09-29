import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/authentication';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  adminEmail: string = localStorage.getItem('admin_email') || '';

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    public authService: AuthService
  ) {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],     
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
      ]],
      newPasswordBis: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  collectFormErrors(): string[] {
    const errors: string[] = [];
    
    const passwordControl = this.changePasswordForm.get('password');
    const newPasswordControl = this.changePasswordForm.get('newPassword');
    const confirmPasswordControl = this.changePasswordForm.get('newPasswordBis');
    
    if (passwordControl?.errors?.['required']) {
      errors.push('Le mot de passe actuel est requis');
    }
    
    if (newPasswordControl?.errors?.['required']) {
      errors.push('Le nouveau mot de passe est requis');
    }
    
    if (newPasswordControl?.errors?.['minlength']) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (newPasswordControl?.errors?.['pattern']) {
      errors.push('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
    }
    
    if (confirmPasswordControl?.errors?.['required']) {
      errors.push('La confirmation du mot de passe est requise');
    }
    
    if (this.changePasswordForm.errors?.['passwordMismatch']) {
      errors.push('Les mots de passe ne correspondent pas');
    }
    
    return errors;
  }

  // Validateur personnalisé pour vérifier que les deux mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('newPasswordBis')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  updatePassword(): void {
    // Collecter toutes les erreurs 
    const errors = this.collectFormErrors();

    if (errors.length > 0) {
    // Afficher les erreurs dans une alerte
    alert('Erreurs dans le formulaire:\n' + errors.join('\n'));
    return;
    }
    
    if (this.changePasswordForm.valid) {
      
      this.authService.changePassword(this.changePasswordForm.value.password, this.changePasswordForm.value.newPassword, this.adminEmail).subscribe({
        next: () => {
          alert('Votre mot de passe a été mise à jour avec succès');
          this.navigateTo('/dashboard/home');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            alert('Mot de passe actuel incorrect.');
          } else {
            alert(error.error?.message || 'Une erreur est survenue lors de la mise à jour du mot de passe.');
          }
        }
      });
    }
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}