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

  ngOnInit() {
    // this.loadGoogleScript().then(() => {
      // this.initializeGoogleSignIn();
    // }).catch(err => {
      // console.error('Google Sign-In Script konnte nicht geladen werden', err);
    // });
  }

  changeToRegestration() {
    this.router.navigate(['/regestration']);
  }

  changeToResetPasswortComponent() {
    this.router.navigate(['/reset-email']);
  }

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
      alert('Login fehlgeschlagen');
      console.error(e);
    }
  }

  // Dynamisch das Google-Sign-In-Script laden
  loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-jssdk')) {
        resolve(); // Skript bereits geladen
        return;
      }

      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://accounts.google.com/gsi/client';
      scriptElement.id = 'google-jssdk';
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.onload = () => resolve();
      scriptElement.onerror = (err) => reject(err);

      document.body.appendChild(scriptElement);
    });
  }

  initializeGoogleSignIn() {
    // Jetzt kann google verwendet werden, da das Skript geladen ist
    google.accounts.id.initialize({
      client_id: '201008435262-5lp0s5cg108itfk5hdknka4qv0ktej05.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.prompt();
  }

  triggerGoogleSignIn() {
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        google.accounts.id.renderButton(
          document.getElementById("googleLoginButton"),
          { theme: "outline", size: "large", text: "continue_with" }
        );
      }
    });
  }

  handleCredentialResponse(response: any) {
    this.as.googleLogin(response.credential).subscribe(
      (res) => {
        if (res.isNewUser) {
          console.log('New user registered via Google');
        } else {
          console.log('Existing user logged in via Google');
        }
        this.router.navigateByUrl('/chat');
      },
      (error) => {
        console.error('Google authentication failed', error);
      }
    );
  }

  async guestLogin(){
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

