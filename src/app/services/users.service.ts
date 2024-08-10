import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  private users: any[] = [];
  private userImages: any [] = [];

  fetchUsers(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/user/").pipe(
      tap(data => this.users = data)  // Nutzer in das Array speichern
    );
  }

  fetchUserImage(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/api/images/").pipe(
      tap(data => this.userImages = data)  // Nutzer Bilder in das Array speichern
    );
  }

  getUsers(): any[] {
    return this.users;
  }

  getUsersImages(): any []{
    return this.userImages;
  }
}
