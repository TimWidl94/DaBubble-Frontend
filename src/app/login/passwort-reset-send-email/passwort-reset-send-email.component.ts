import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { PasswortResetService } from '../../services/passwort-reset.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passwort-reset-send-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './passwort-reset-send-email.component.html',
  styleUrl: './passwort-reset-send-email.component.scss',
})
export class PasswortResetSendEmailComponent {
  passwordResetForm: FormGroup;
  email: string = '';
  emailSendet: boolean = false;
  emailInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswortResetService,
    private router: Router
  ) {
    this.passwordResetForm = this.fb.group({
      email: [''],
    });
  }

  onSubmit() {
    let email = this.email;
    this.emailInvalid = false;
    this.passwordResetService.sendPasswordResetEmail(email).subscribe(
      (response) => {
        console.log('Reset email sent', response);
        this.emailSendet = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error) => {
        console.log('Error sending reset email', error);
      }
    );
  }

  checkEmailFilled() {
    if (this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.emailInvalid = true;
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
