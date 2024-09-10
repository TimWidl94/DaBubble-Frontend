import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss',
})
export class LoginformComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private as: AuthService
  ) {}

  EmailInvalid: boolean = false;
  PwOrEmailWrong: boolean = false;

  loginScreen: boolean = true;
  regestrationScreen: boolean = false;

  changeToRegestration() {
    this.router.navigate(['/regestration']);
  }

  email: string = '';
  password: string = '';
  public isLoggedIn: boolean = false;

  async login() {
    try {
      let resp: any = await this.as.loginWithUsernameAndPassword(
        this.email,
        this.password
      );
      // console.log(resp);
      localStorage.setItem('token', resp['token']);
      localStorage.setItem('user', JSON.stringify(resp));
      this.router.navigateByUrl('/chat');
    } catch (e) {
      alert('Login fehlgeschlagen');
      console.error(e);
    }
  }
}
