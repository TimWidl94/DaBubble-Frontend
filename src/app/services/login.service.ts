import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  private registrationScreenSubject = new BehaviorSubject<boolean>(false);
  registrationScreen$ = this.registrationScreenSubject.asObservable();

  private loginScreenSubject = new BehaviorSubject<boolean>(true);
  loginScreen$ = this.loginScreenSubject.asObservable();

  setRegistrationScreen(value: boolean) {
    this.registrationScreenSubject.next(value);
  }

  setLoginScreen(value: boolean){
    this.loginScreenSubject.next(value);
  }
}
