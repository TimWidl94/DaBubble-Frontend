import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilInfoService {

  constructor() { }

  // Subject zum Teilen von User-Daten zwischen den Komponenten
  private userProfileSubject = new Subject<User>();

  // Observable, auf das andere Komponenten zugreifen können
  userProfile$ = this.userProfileSubject.asObservable();

  // Methode, um Daten zu übermitteln
  openProfil(user: User) {
    this.userProfileSubject.next(user);
  }

}
