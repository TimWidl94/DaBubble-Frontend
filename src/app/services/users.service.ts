import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
    this.loadAllUser();
    this.loadUserImage();
   }

  private users: any[] = [];
  private userImages: any [] = [];

  private apiUrl = environment.baseUrl;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  private allUserSubject = new BehaviorSubject<any>(null);
  public allUser$ = this.allUserSubject.asObservable();

  private userImageSubject = new BehaviorSubject<any>(null);
  public userImage$ = this.userImageSubject.asObservable();

  private token: string | null = null;

  fetchUsers(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/users/").pipe(
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


  loadAllUser(){
    this.http.get<any>("http://localhost:8000/users/").subscribe(
      (users) => {
        this.allUserSubject.next(users);
        this.fetchUsers();
      }
    )
  }

  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
      this.http.get<any>(`${this.apiUrl}/user/`, { headers }).subscribe(
        (user) => {
          this.userSubject.next(user); // Setze die neuesten Benutzerdaten
        },
        (error) => {
          console.error('Fehler beim Laden des Benutzers:', error);
          this.userSubject.next(null); // Reset bei Fehler
        }
      );
    } else {
      console.error('Kein Token vorhanden. Benutzer ist nicht authentifiziert.');
      this.userSubject.next(null);
    }
  }

  loadUserImage(){
    const token = localStorage.getItem('token');
    if (token){
      const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
      this.http.get<any>(`${this.apiUrl}/activeUserImage/`, {headers}).subscribe(
        (image) => {
          this.userImageSubject.next(image);
        },
        (e) => {
          console.error('Fehler beim laden des User Images', e)
          this.userImageSubject.next(null);
        }
      )
    }
  }

  // Methode, um den aktuell gespeicherten User zu bekommen
  getUser(): any {
    return this.userSubject.value;
  }
}
