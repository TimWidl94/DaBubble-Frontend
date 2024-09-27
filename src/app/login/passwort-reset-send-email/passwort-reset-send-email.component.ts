import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { PasswortResetService } from '../../services/passwort-reset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passwort-reset-send-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './passwort-reset-send-email.component.html',
  styleUrl: './passwort-reset-send-email.component.scss'
})
export class PasswortResetSendEmailComponent {

  passwordResetForm: FormGroup;
  email: string = '';

  constructor(private fb: FormBuilder, private passwordResetService: PasswortResetService, private router: Router,) {
    this.passwordResetForm = this.fb.group({
      email: ['']
    });
  }

  onSubmit() {
    let email = this.email;
    this.passwordResetService.sendPasswordResetEmail(email).subscribe(
      response => {
        console.log('Reset email sent', response);
      },
      error => {
        console.log('Error sending reset email', error);
      }
    );
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
