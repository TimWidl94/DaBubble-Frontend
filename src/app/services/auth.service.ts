import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      this.userSubject.next(user);
      this.token = localStorage.getItem('token');
    }
  }

  private registrationData = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  };

  private apiUrl = environment.baseUrl;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();
  private token: string | null = null;

  loginWithUsernameAndPassword(email: string, password: string) {
    const url = `${this.apiUrl}login/`;
    const body = { email: email, password: password };
    return lastValueFrom(this.http.post(url, body));
  }

  logout() {
    this.token = null;
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getUser() {
    return this.userSubject.value;
  }

  getToken() {
    return this.token;
  }

  register(
    username: string,
    password: string,
    email: string,
    first_name: string,
    last_name: string
  ): Observable<any> {
    const url = environment.baseUrl + 'register/';
    return this.http.post<any>(url, {
      username,
      password,
      email,
      first_name,
      last_name,
    });
  }

  setRegistrationData(
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string
  ) {
    this.registrationData = {
      username,
      email,
      password,
      first_name,
      last_name,
    };
  }

  getRegistrationData() {
    return this.registrationData;
  }
}
