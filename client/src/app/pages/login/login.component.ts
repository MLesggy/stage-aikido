import { ChangeDetectionStrategy, Component, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/authentication';
import { ModalService } from '../../services/modal/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, FormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public authService: AuthService, private router: Router, public modalService: ModalService){
    this.loginForm = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    });
  }

  get email(){
    return this.loginForm.get('email')!;
  }

  get password(){
    return this.loginForm.get('password')!;
  }

  login(){
    const val = this.loginForm.value;

    if (val.email && val.password){
      this.authService.login(val.email, val.password).subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard/home');
        },
                error: () => {
          alert("Votre email ou votre mot de passe n'est pas valide");
        }
      })
    }
  }

  navigateTo(path: string){
    this.router.navigateByUrl(path);
  }

 @ViewChild('PasswordRecoveryTemplate') PasswordRecoveryTemplate!: TemplateRef<any>;

  // FormGroup with FormControl to check inputs && Initialisation called in OnInit()
  passwordRecoveryForm! : FormGroup;

  initForm(): void {
    this.passwordRecoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Open the form for given recommendation_id
  openModal() {
    this.initForm(); //reseting the form
    this.modalService.open('Mot de passe oublié', this.PasswordRecoveryTemplate);
  }

  // Close the form
  closeModal() {
    this.modalService.close();
  }

  // Checking if are updating a link or if we are creating a new link
  onSubmit() {
    if (this.passwordRecoveryForm.invalid){
       alert('L\'email n\'est pas valide'); //invalid data in input
      return
    }else{
       this.authService.getResetToken(this.passwordRecoveryForm.value.email).subscribe({
          next: () => {
            alert('Un email a été envoyé');
            this.router.navigateByUrl('/login');
        },
          error: () => {
            alert("Votre mot de passe n'est pas valide");
        }
       });
    }
    this.closeModal();
  }


}