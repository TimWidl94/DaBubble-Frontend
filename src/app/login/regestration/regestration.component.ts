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
  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) {}

  isHovered: boolean = false;
  backgroundImage = 'assets/icons/checkbox_blank.svg';
  checkboxChecked: boolean = false;

  name: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  password: string = '';
  username: string = '';

  nameEmpty: boolean = false;
  emailInvalid: boolean = false;
  pwEmpty: boolean = false;

  buttonDisabled: boolean = true;

  /**
   * Toggles the hover state for a UI element.
   * @param isHovered Indicates whether the element is hovered or not.
   */
  onHover(isHovered: boolean) {
    this.isHovered = isHovered;
  }

  /**
   * Changes the data protection checkbox image and toggles the checkbox state.
   * Updates the button's enabled state based on the checkbox status.
   * @param imagePath The path of the image to display for the checkbox.
   */
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

  /**
   * Navigates to the profile creation screen if the button is enabled.
   * Extracts the first and last name from the full name and passes them as query parameters.
   */
  changeToCreateProfilScreen() {
    if (!this.buttonDisabled) {
      const [first_name, last_name] = this.splitName(this.name);
      let username = first_name + last_name;
      this.authService.setRegistrationData(
        username,
        this.email,
        this.password,
        first_name,
        last_name
      );
      this.router.navigate(['/create-profile'], {
        queryParams: { first_name: first_name, last_name: last_name },
      });
    }
  }

  /**
   * Splits a full name into first and last name.
   * @param fullName The full name to split.
   * @returns An array containing the first name and last name.
   */
  splitName(fullName: string): [string, string] {
    let nameParts = fullName.trim().split(' ');
    let first_name = nameParts[0];
    let last_name = nameParts.slice(1).join(' ');
    return [first_name, last_name];
  }

  /**
   * Navigates the user back to the login page.
   */
  backToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Enables the button by setting the `buttonDisabled` property to false.
   */
  enableButton() {
    this.buttonDisabled = false;
  }

  /**
   * Handles input changes for various fields, such as name, email, and password.
   * Updates validation flags and button states based on the input.
   * @param field The name of the field being updated ('name', 'email', 'password').
   */
  onInputChange(field: string) {
    if (field === 'name') {
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
