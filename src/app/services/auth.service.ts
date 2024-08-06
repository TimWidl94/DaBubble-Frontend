import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private registrationData = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  };

  private apiUrl = environment.baseUrl;

  loginWithUsernameAndPassword(
    email: string,
    password: string
  ): Observable<any> {
    const url = `${this.apiUrl}login/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, { email, password }, { headers });
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
