import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/authentication';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css'
})
export class ChangeEmailComponent implements OnInit {

  changeEmailForm: FormGroup;
  adminEmail: string = localStorage.getItem('admin_email') || '';
  adminId: number = parseInt(localStorage.getItem('admin_id') || '');

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    public authService: AuthService
  ) {
    this.changeEmailForm = this.formBuilder.group({
      currentEmail: [{value: '', disabled: true}],
      newEmail: ['', [Validators.required, Validators.email]],
      newEmailConfirm: ['', [Validators.required]]
    }, { validators: this.emailMatchValidator });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    // Préremplir le champ email actuel
    this.changeEmailForm.patchValue({
      currentEmail: this.adminEmail
    });
  }

  collectFormErrors(): string[] {
    const errors: string[] = [];
    
    const newEmailControl = this.changeEmailForm.get('newEmail');
    const confirmEmailControl = this.changeEmailForm.get('newEmailConfirm');
    
    if (newEmailControl?.errors?.['required']) {
      errors.push('La nouvelle adresse e-mail est requise');
    }
    
    if (newEmailControl?.errors?.['email']) {
      errors.push('Veuillez entrer une adresse e-mail valide');
    }
    
    if (confirmEmailControl?.errors?.['required']) {
      errors.push('La confirmation de l\'adresse e-mail est requise');
    }
    
    if (this.changeEmailForm.errors?.['emailMismatch']) {
      errors.push('Les adresses e-mail ne correspondent pas');
    }
    
    return errors;
  }

  // Validateur personnalisé pour vérifier que les deux adresses e-mail correspondent
  emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newEmail = control.get('newEmail')?.value;
    const confirmEmail = control.get('newEmailConfirm')?.value;
    return newEmail === confirmEmail ? null : { emailMismatch: true };
  }

  updateEmail(): void {
    // Collecter toutes les erreurs 
    const errors = this.collectFormErrors();

    if (errors.length > 0) {
      // Afficher les erreurs dans une alerte
      alert('Erreurs dans le formulaire:\n' + errors.join('\n'));
      return;
    }
    
    if (this.changeEmailForm.valid) {
      // Vérifier si la nouvelle adresse est différente de l'ancienne
      if (this.changeEmailForm.value.newEmail === this.adminEmail) {
        alert('La nouvelle adresse e-mail doit être différente de l\'adresse actuelle');
        return;
      }

      
      this.authService.changeEmail(this.changeEmailForm.value.newEmail, this.adminId).subscribe({
        next: (response) => {
          // Mettre à jour l'email dans le localStorage
          localStorage.setItem('admin_email', this.changeEmailForm.value.newEmail);
          alert('Votre adresse e-mail a été mise à jour avec succès');
          this.navigateTo('/dashboard/home');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            alert('Cette adresse e-mail est déjà utilisée par un autre compte.');
          } else {
            alert(error.error?.message || 'Une erreur est survenue lors de la mise à jour de l\'adresse e-mail.');
          }
        }
      });
    }
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}