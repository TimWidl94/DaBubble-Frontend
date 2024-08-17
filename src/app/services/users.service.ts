import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {
    this.loadUserFromToken();
    this.loadAllUser();
    this.loadUserImage();
  }

  private users: any[] = [];
  private userImages: any[] = [];
  private apiUrl = environment.baseUrl;

  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  private allUserSubject = new BehaviorSubject<any[]>([]);
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
      this.allUserSubject.next(this.users); // Aktualisierte Nutzerliste bereitstellen
    });
  }

  fetchUsers(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/users/').pipe(
      tap((data) => (this.users = data)) // Nutzer in das Array speichern
    );
  }

  fetchUserImage(): Observable<any> {
    return this.http.get<any>('http://localhost:8000/api/images/').pipe(
      tap((data) => (this.userImages = data)) // Nutzerbilder in das Array speichern
    );
  }

  getUsers(): any[] {
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
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      const userid = user.id;
      for (let x = 0; x < this.userImages.length; x++) {
        const userImage = this.userImages[x];
        const userImgId = userImage.user;
        if (userid === userImgId) {
          user.imagepath = userImage.image_path;
          user.image = userImage.image;
        }
      }
    }
  }
}
