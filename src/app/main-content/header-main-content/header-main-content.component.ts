import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { MediaChangeViewService } from '../../services/media-change-view.service';

@Component({
  selector: 'app-header-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchbarComponent],
  templateUrl: './header-main-content.component.html',
  styleUrls: ['./header-main-content.component.scss'],
})
export class HeaderMainContentComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router,
    private userService: UsersService,
    private mediaChangeViewService: MediaChangeViewService,
    private cdRef: ChangeDetectorRef
  ) {}

  // user: User | null = null;
  profil_img: string = 'assets/img/avatar/avatar_empty.svg';
  menuOpen: boolean = false;
  profilOpen: boolean = false;
  profilEditOpen: boolean = false;
  fullName: string = '';
  first_name: string = '';
  last_name: string = '';
  name: string = '';
  email: string = '';

  @Input() users: User[] = [];
  @Input() user!: User;

  devspaceMobileOn: boolean = false;

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt das Benutzerbild, Benutzerbilder und die Devspace-Header-Anzeigeeinstellung für die mobile Ansicht.
   */
  ngOnInit() {
    this.userService.loadUserImage();
    this.loadUserImages();
    this.loadDevspaceHeaderMobile();
  }

  /**
   * Lädt die Einstellung zur Anzeige des Devspace-Headers für die mobile Ansicht und aktualisiert den Zustand,
   * wenn sich dieser ändert.
   */
  loadDevspaceHeaderMobile() {
    this.mediaChangeViewService.headerDevspaceMobileOn$.subscribe(
      (headerDevspaceMobileOn) => {
        this.devspaceMobileOn = headerDevspaceMobileOn;
        this.cdRef.detectChanges();
      }
    );
  }

  /**
   * Lädt das Benutzerbild und speichert es in der `profil_img`-Variable.
   */
  loadUserImages() {
    this.userService.userImage$.subscribe((image) => {
      if (image) {
        this.profil_img = image.image ? image.image : image.image_path;
      }
    });
  }

  /**
   * Öffnet oder schließt das Header-Menü.
   */
  openHeaderMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Führt den Logout-Prozess durch, ruft die Logout-Methode des AuthService auf und navigiert anschließend
   * zur Login-Seite. Gibt eine Fehlermeldung aus, wenn der Logout fehlschlägt.
   */
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login');
    } catch (e) {
      alert('Logout fehlgeschlagen');
      console.error(e);
    }
  }

  /**
   * Öffnet oder schließt das Profil-Menü. Wenn das Header-Menü geöffnet ist, wird es ebenfalls geschlossen.
   */
  openProfil() {
    this.profilOpen = !this.profilOpen;
    if (this.menuOpen) {
      this.menuOpen = !this.menuOpen;
    }
  }

  /**
   * Öffnet das Bearbeitungsformular für die Benutzerinformationen, indem das Profil-Menü geöffnet und das
   * Bearbeitungsformular umgeschaltet wird. Setzt den vollständigen Namen des Benutzers.
   */
  openEditProfilInformation() {
    this.openProfil();
    this.profilEditOpen = !this.profilEditOpen;
    this.fullName = this.getFullName();
  }

  /**
   * Schließt das Bearbeitungsformular für Benutzerinformationen.
   */
  closeEditProfilInformation() {
    this.profilEditOpen = !this.profilEditOpen;
  }

  /**
   * Aktualisiert die Benutzerinformationen mit den neuen Werten aus dem Bearbeitungsformular und lädt die
   * Benutzer- und Bilddaten neu. Schließt das Bearbeitungsformular nach erfolgreicher Aktualisierung.
   */
  async editUserInformation() {
    this.splitFullName(this.fullName);
    const updatedUser = {
      ...this.user,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.user?.email,
    };
    this.authService.updateUser(updatedUser).subscribe(
      (response) => {
        this.userService.loadUserFromToken();
        this.userService.loadAndCombineUsersAndImages();
        this.profilEditOpen = false;
      },
      (e) => {
        console.error('Fehler beim Aktualisieren des Benutzers', e);
      }
    );
  }

  /**
   * Teilt den vollständigen Namen des Benutzers in Vorname und Nachname auf.
   * @param fullName Der vollständige Name des Benutzers.
   */
  splitFullName(fullName: string) {
    let nameParts = fullName.trim().split(' ');
    this.first_name = nameParts[0];
    this.last_name = nameParts.slice(1).join(' ');
  }

  /**
   * Gibt den vollständigen Namen des Benutzers zurück, wenn dieser verfügbar ist.
   * @returns Der vollständige Name des Benutzers.
   */
  getFullName() {
    return this.user ? `${this.user.first_name} ${this.user.last_name}` : '';
  }

  /**
   * Schließt alle offenen Header-Menüs (Profil-Menü, Bearbeitungsformular und Header-Menü).
   */
  closeHeaderMenus() {
    this.profilOpen = false;
    this.profilEditOpen = false;
    this.menuOpen = false;
  }

  /**
   * Stellt die Ansicht auf den Devspace-Bereich in der mobilen Ansicht zurück, indem die entsprechenden
   * Einstellungen der mobilen Ansicht aktualisiert werden.
   */
  backToDevspaceMobile() {
    this.mediaChangeViewService.setChatScreenMobile(false);
    this.mediaChangeViewService.setDevspaceScreenMobile(true);
    this.mediaChangeViewService.setDevspaceHeaderMobile(false);
    this.mediaChangeViewService.setThreadScreenMobile(false);
  }

  /**
   * Schließt das Bearbeitungsformular und öffnet das Profil-Menü.
   */
  closeEditUser() {
    this.profilEditOpen = false;
    this.profilOpen = true;
  }
}
