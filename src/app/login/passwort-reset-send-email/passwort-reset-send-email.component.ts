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

  /**
   * Sends a password reset email to the provided email address.
   * Marks the email as sent upon success and navigates to the login page after a delay.
   * Handles and logs errors if the email fails to send.
   */
  onSubmit() {
    let email = this.email;
    this.emailInvalid = false;
    this.passwordResetService.sendPasswordResetEmail(email).subscribe(
      (response) => {
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

  /**
   * Validates the email field to check if it is filled with a valid email format.
   * Updates the `emailInvalid` flag based on the result.
   */
  checkEmailFilled() {
    if (this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.emailInvalid = true;
    }
  }

  /**
   * Navigates the user back to the login page.
   */
  backToLogin() {
    this.router.navigate(['/login']);
  }
}
