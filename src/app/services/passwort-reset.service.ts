import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswortResetService {
  private apiUrl = 'http://localhost:8000/password_reset/';

  constructor(private http: HttpClient) {}

  sendPasswordResetEmail(emailName: string): Observable<any> {
    let body = {emailName}
    return this.http.post(this.apiUrl,  body );
  }
}
