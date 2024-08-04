import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss'
})
export class LoginformComponent {

  constructor(private loginService: LoginService){  }

  EmailInvalid:boolean = false;
  PwOrEmailWrong:boolean = false;

  loginScreen: boolean = true;
  regestrationScreen: boolean = false;

  changeToRegestration(){
    if(this.loginScreen){
      this.loginService.setRegistrationScreen(true);
      this.loginService.setLoginScreen(false);
    }
  }
}
