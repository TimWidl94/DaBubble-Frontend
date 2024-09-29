import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswortResetService } from '../../services/passwort-reset.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passwort-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './passwort-reset.component.html',
  styleUrl: './passwort-reset.component.scss',
})
export class PasswortResetComponent {
  password: string = '';
  passwordConfirm: string = '';
  btnActive: boolean = false;
  token: string | null = null;
  uid: string | null = null;
  passwordChanged: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private passwordResetService: PasswortResetService,
    private router: Router
  ) {}

  ngOnInit() {
    this.readParams();
  }

  onSubmit() {
    this.passwordResetService
      .sendPasswordResetConfirm(this.password, this.uid, this.token)
      .subscribe(
        (response) => {
          console.log('new password accepted', response);
          this.passwordChanged = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error) => {
          console.log('Error sending reset email', error);
        }
      );
  }

  readParams() {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
      this.uid = params.get('uid');

      console.log('Token:', this.token);
      console.log('UID:', this.uid);
    });
  }

  checkIfPasswordMatch() {
    if (
      this.password.toLowerCase().trim() ==
      this.passwordConfirm.toLowerCase().trim()
    ) {
      this.btnActive = true;
      console.log(this.btnActive);
    } else {
      this.btnActive = false;
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
