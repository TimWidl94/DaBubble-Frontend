import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
declare const google: any;

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss',
})
export class LoginformComponent {
  constructor(
    private router: Router,
    private as: AuthService,
    private http: HttpClient
  ) {}

  EmailInvalid: boolean = false;
  PwOrEmailWrong: boolean = false;

  loginScreen: boolean = true;
  regestrationScreen: boolean = false;

  email: string = '';
  password: string = '';
  public isLoggedIn: boolean = false;

  /**
   * Navigates the user to the registration page.
   */
  changeToRegestration() {
    this.router.navigate(['/regestration']);
  }

  /**
   * Navigates the user to the password reset email component.
   */
  changeToResetPasswortComponent() {
    this.router.navigate(['/reset-email']);
  }

  /**
   * Logs in the user using the provided email and password. Stores the token and user data in local storage
   * and redirects to the chat page. Displays an error message if login fails.
   */
  async login() {
    try {
      let resp: any = await this.as.loginWithUsernameAndPassword(
        this.email,
        this.password
      );
      localStorage.setItem('token', resp['token']);
      localStorage.setItem('user', JSON.stringify(resp));
      this.router.navigateByUrl('/chat');
    } catch (e) {
      // alert('Login fehlgeschlagen');
      this.PwOrEmailWrong=true;
      this.password = '';
    }
  }

  /**
   * Logs in a guest user using default credentials. Stores the token and user data in local storage
   * and redirects to the chat page. Displays an error message if login fails.
   */
  async guestLogin() {
    try {
      let resp: any = await this.as.loginWithUsernameAndPassword(
        'guest@gmail.com',
        'password123456'
      );
      localStorage.setItem('token', resp['token']);
      localStorage.setItem('user', JSON.stringify(resp));
      this.router.navigateByUrl('/chat');
    } catch (e) {
      alert('Login fehlgeschlagen');
      console.error(e);
    }
  }
}
