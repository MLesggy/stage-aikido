import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/authentication';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-recovery',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})

export class PasswordRecoveryComponent implements OnInit {

  resetPasswordForm: FormGroup;
  token!: string;
  isValidToken: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
      ]],
      newPasswordBis: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        // Utilisez le token pour la réinitialisation
        this.authService.verifyResetToken(token.toString()).subscribe({

          next: () => {
            this.token = token;
            this.isValidToken = true;
          },
          error: (error) => {
            alert('URL invalide ou expirée');
          }
        }
        );
      }
    });
  }

  collectFormErrors(): string[] {
    const errors: string[] = [];

    const newPasswordControl = this.resetPasswordForm.get('newPassword');
    const confirmPasswordControl = this.resetPasswordForm.get('newPasswordBis');

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

    if (this.resetPasswordForm?.errors?.['passwordMismatch']) {
      errors.push('Les mots de passe ne correspondent pas');
    }

    return errors;
  }

  // Validateur personnalisé pour vérifier que les deux mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('password')?.value;
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

    if (this.resetPasswordForm.valid) {

      this.authService.setNewPassword(this.resetPasswordForm.value.password, this.token).subscribe({
        next: (response) => {
          alert("Le mot de passe a été changé.");
          this.navigateTo('/login');
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
