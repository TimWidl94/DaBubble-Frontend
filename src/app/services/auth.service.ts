import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private registrationData = {
    username: '',
    email: '',
    password: ''
  };

  loginWithUsernameAndPassword(username: string, password: string): Observable<any> {
    const url = environment.baseUrl + 'login/';
    return this.http.post<any>(url, { username, password });
  }

  register(username: string, password: string, email: string, avatar: string): Observable<any> {
    const url = environment.baseUrl + 'register/';
    return this.http.post<any>(url, { username, password, email, avatar });
  }

  setRegistrationData(username: string, email: string, password: string) {
    this.registrationData = { username, email, password };
  }

  getRegistrationData() {
    return this.registrationData;
  }
}
