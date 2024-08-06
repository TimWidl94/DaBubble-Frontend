import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss'
})
export class LoginformComponent {

  constructor(private loginService: LoginService, private router: Router){  }

  EmailInvalid:boolean = false;
  PwOrEmailWrong:boolean = false;

  loginScreen: boolean = true;
  regestrationScreen: boolean = false;

  changeToRegestration(){
    this.router.navigate(['/regestration']);
  }
}
