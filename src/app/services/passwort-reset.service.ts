import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PasswortResetService {

  constructor(private http: HttpClient) {}

  sendPasswordResetEmail(emailName: string): Observable<any> {
    let url = environment.baseUrl + 'password_reset/';
    let body = {emailName}
    return this.http.post(url,  body );
  }

  sendPasswordResetConfirm(password: string, userId: string | null, token: string | null){
    let url = environment.baseUrl + 'password_reset_confirm/';
    let body= {
      uid : userId,
      password : password,
      token: token,
    }
    return this.http.post(url, body);
  }


}
