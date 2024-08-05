import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginformComponent } from './loginform/loginform.component';
import { LoginService } from '../services/login.service';
import { RegestrationComponent } from "./regestration/regestration.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { CreateProfilComponent } from './create-profil/create-profil.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginformComponent, RegestrationComponent, FooterComponent, CreateProfilComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private loginService: LoginService){}

  loginScreen: boolean = true;
  regestrationScreen: boolean = false;
  createProfilScreen: boolean = false;

  ngOnInit(){
    this.loginService.registrationScreen$.subscribe(value => {
      this.regestrationScreen = value;
    });
    this.loginService.loginScreen$.subscribe(value => {
      this.loginScreen = value;
    })
    this.loginService.createProfilScreen$.subscribe(value => {
      this.createProfilScreen = value;
    })
  }

}
