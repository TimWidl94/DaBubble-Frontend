import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

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

  changeToRegestration() {
    this.router.navigate(['/regestration']);
  }

  changeToResetPasswortComponent(){
    this.router.navigate(['/reset-email']);
  }

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
