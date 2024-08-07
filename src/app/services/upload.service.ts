import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:8000/api/images/';

  constructor(private http: HttpClient) { }

  uploadImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Hole das Token aus dem LocalStorage
    console.log('Token:', token); // Überprüfe, ob das Token vorhanden ist
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }

  getUserImages(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
