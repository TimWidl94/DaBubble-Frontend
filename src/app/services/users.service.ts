import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { forkJoin } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {
    this.loadAndCombineUsersAndImages();
    this.loadUserFromToken();
  }

  private users: User[] = [];
  private userImages: any[] = [];
  private apiUrl = environment.baseUrl;

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private allUserSubject = new BehaviorSubject<User[]>([]);
  public allUser$ = this.allUserSubject.asObservable();

  private userImageSubject = new BehaviorSubject<any>(null);
  public userImage$ = this.userImageSubject.asObservable();

  private token: string | null = null;

  // Methode zum Laden aller Benutzer und ihrer Bilder und zum Zusammenführen der Daten
  loadAndCombineUsersAndImages() {
    forkJoin({
      users: this.fetchUsers(),
      userImages: this.fetchUserImage(),
    }).subscribe(({ users, userImages }) => {
      this.users = users;
      this.userImages = userImages;
      this.setUserImageToUser();
      this.allUserSubject.next(this.users); // Nur einmal aktualisieren
    });
  }

  private fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8000/users/').pipe(
      tap((data) => this.users = data)
    );
  }

  fetchUserImage(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/images/').pipe(
      tap((data) => this.userImages = data)
    );
  }

  getUsers(): User[] {
    return this.users;
  }

  getUsersImages(): any[] {
    return this.userImages;
  }

  loadAllUser() {
    this.fetchUsers().subscribe((users) => {
      this.allUserSubject.next(users);
    });
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

  loadUserImage() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
      this.http
        .get<any>(`${this.apiUrl}/activeUserImage/`, { headers })
        .subscribe(
          (image) => {
            this.userImageSubject.next(image);
          },
          (e) => {
            console.error('Fehler beim Laden des User Images', e);
            this.userImageSubject.next(null);
          }
        );
    }
  }

  // Methode, um den aktuell gespeicherten User zu bekommen
  getUser(): any {
    return this.userSubject.value;
  }

  // Methode, um die Benutzerbilder den Benutzern zuzuordnen
  private setUserImageToUser() {
    this.users.forEach(user => {
      const matchingImage = this.userImages.find(image => image.user === user.id);
      if (matchingImage) {
        user.imagepath = matchingImage.image_path;
        user.image = matchingImage.image;
      }
    });
  }
}
