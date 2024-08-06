import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-regestration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regestration.component.html',
  styleUrl: './regestration.component.scss',
})
export class RegestrationComponent {
  constructor(private loginService: LoginService, private router: Router,private authService: AuthService) {}

  isHovered: boolean = false;
  backgroundImage = 'assets/icons/checkbox_blank.svg';
  checkboxChecked: boolean = false;

  name: string = '';
  email: string = '';
  password: string = '';

  nameEmpty: boolean = false;
  emailInvalid: boolean = false;
  pwEmpty: boolean = false;

  buttonDisabled: boolean = true;

  onHover(isHovered: boolean) {
    this.isHovered = isHovered;
  }

  changeDataProtectionImg(imagePath: string) {
    if (!this.checkboxChecked) {
      this.backgroundImage = imagePath;
      this.checkboxChecked = true;
      this.onInputChange('password');
    } else {
      this.backgroundImage = 'assets/icons/checkbox_blank.svg';
      this.checkboxChecked = false;
      this.buttonDisabled = true;
      this.onInputChange('password');
    }
  }

  changeToCreateProfilScreen() {
    if (!this.buttonDisabled) {
      this.authService.setRegistrationData(this.name, this.email, this.password);
      this.router.navigate(['/create-profile']);
    }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  enableButton() {
    this.buttonDisabled = false;
  }

  onInputChange(field: string) {
    if (field == 'name') {
      this.nameEmpty = !this.name.trim();
    }

    if (field === 'email') {
      this.emailInvalid = !this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }

    if (field === 'password') {
      this.pwEmpty = !this.password.trim();
      if (this.password.length <= 7) {
        this.pwEmpty = true;
        this.buttonDisabled = true;
      }
    }

    if (this.password.length >= 8 && this.checkboxChecked) {
      this.buttonDisabled =
        this.nameEmpty ||
        this.emailInvalid ||
        this.pwEmpty ||
        !this.checkboxChecked;
    }
  }
}
