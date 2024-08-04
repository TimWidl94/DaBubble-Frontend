import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginformComponent } from './loginform/loginform.component';
import { LoginService } from '../services/login.service';
import { RegestrationComponent } from "./regestration/regestration.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginformComponent, RegestrationComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private loginService: LoginService){}

  loginScreen: boolean = true;
  regestrationScreen: boolean = false;

  ngOnInit(){
    this.loginService.registrationScreen$.subscribe(value => {
      this.regestrationScreen = value;
    });
    this.loginService.loginScreen$.subscribe(value => {
      this.loginScreen = value;
    })
  }

}
