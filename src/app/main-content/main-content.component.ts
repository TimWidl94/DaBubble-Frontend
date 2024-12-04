import { UsersService } from './../services/users.service';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { HeaderMainContentComponent } from './header-main-content/header-main-content.component';
import { DevspaceSectionComponent } from './devspace-section/devspace-section.component';
import { CommonModule } from '@angular/common';
import { ChatSectionComponent } from './chat-section/chat-section.component';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ThreadSectionComponent } from './thread-section/thread-section.component';
import { ProfilInfoComponent } from './chat-section/profil-info/profil-info.component';
import { MediaChangeViewService } from '../services/media-change-view.service';
import { MessageService } from '../services/message.service';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderMainContentComponent,
    DevspaceSectionComponent,
    CommonModule,
    ChatSectionComponent,
    ThreadSectionComponent,
    ProfilInfoComponent,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private mediaChangeViewService: MediaChangeViewService,
    private channelService: ChannelService,
    private messageService: MessageService
  ) {}

  isHoveredDevspaceClose: boolean = false;
  isHoveredDevspaceOpen: boolean = false;
  menuIconOpen: string = 'assets/icons/open_devspace_black.svg';
  menuIconClose: string = 'assets/icons/close_devspace_black.svg';
  devspaceOpen: boolean = true;
  users: User[] = [];
  chatChannelOpen: boolean = true;
  user!: User;
  threadOpen: boolean = false;

  isMobileView: boolean = false;

  devspaceMediaOpen: boolean = true;
  chatMediaOpen: boolean = false;
  threadMediaOpen: boolean = false;

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt den aktuellen Benutzer, die Benutzerliste und stellt die Ansicht für mobile Geräte ein.
   */
  ngOnInit(): void {
    this.authService.getActuellUser(); // Lädt den aktuellen Benutzer
    this.user = this.authService.getUser(); // Setzt den Benutzer aus dem Authentifizierungsservice
    this.loadUsers(); // Lädt alle Benutzer
    this.isMobileView = this.checkScreenWidth(); // Überprüft, ob der Bildschirm ein mobiles Gerät ist
    this.loadMobileChannelBooleans(); // Lädt die mobilen Kanalansichts-Booleans
    this.channelService.loadSelectedChannel(1); // Lädt den ausgewählten Kanal mit der ID 1
    this.messageService.getMessages(1); // Lädt die Nachrichten des Kanals mit der ID 1
  }

  /**
   * Lädt alle Benutzer und setzt die Benutzerliste in den Zustand der Komponente.
   */
  loadUsers() {
    this.userService.allUser$.subscribe((users) => {
      this.users = users;
      this.cdRef.detectChanges(); // Erzeugt eine Änderungserkennung, um die Benutzeranzeige zu aktualisieren
    });
  }

  /**
   * Lädt die Booleans für die mobilen Ansichten von Devspace, Chat und Thread.
   * Aktualisiert den Zustand der Komponente je nach Ansicht.
   */
  loadMobileChannelBooleans() {
    this.mediaChangeViewService.devspaceScreen$.subscribe((mobileView) => {
      this.devspaceMediaOpen = mobileView;
      this.cdRef.detectChanges(); // Erzeugt eine Änderungserkennung für die Devspace-Ansicht
    });

    this.mediaChangeViewService.chatScreen$.subscribe((mobileView) => {
      this.chatMediaOpen = mobileView;
      this.cdRef.detectChanges(); // Erzeugt eine Änderungserkennung für die Chat-Ansicht
    });

    this.mediaChangeViewService.threadScreen$.subscribe((mobileView) => {
      this.threadMediaOpen = mobileView;
      this.cdRef.detectChanges(); // Erzeugt eine Änderungserkennung für die Thread-Ansicht
    });
  }

  /**
   * Setzt den Hover-Zustand für das Devspace-Menü und ändert die Icons basierend auf dem Hover-Zustand.
   * @param isHovered Gibt an, ob der Benutzer mit der Maus über das Devspace-Menü fährt.
   */
  onHoverDevspace(isHovered: boolean) {
    this.isHoveredDevspaceClose = isHovered;
    if (!this.isHoveredDevspaceClose) {
      // Setzt die Standard-Icons
      this.menuIconOpen = 'assets/icons/open_devspace_black.svg';
      this.menuIconClose = 'assets/icons/close_devspace_black.svg';
    } else {
      // Setzt die Hover-Icons
      this.menuIconOpen = 'assets/icons/open_devspace_blue.svg';
      this.menuIconClose = 'assets/icons/close_devspace_blue.svg';
    }
  }

  /**
   * Öffnet oder schließt das Devspace-Menü.
   */
  closeDevspace() {
    this.devspaceOpen = !this.devspaceOpen;
  }

  /**
   * Öffnet oder schließt das Thread-Menü.
   */
  openThread() {
    this.threadOpen = !this.threadOpen;
  }

  /**
   * Wird aufgerufen, wenn die Fenstergröße geändert wird.
   * Überprüft, ob der Bildschirm auf mobilen Geräten angezeigt wird.
   * Aktualisiert die `isMobileView`-Eigenschaft.
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileView = this.checkScreenWidth(); // Überprüft die Bildschirmbreite
  }

  /**
   * Überprüft, ob der Bildschirm kleiner als 700px ist und ob es sich um eine mobile Ansicht handelt.
   * @returns `true`, wenn der Bildschirm eine Breite von maximal 700px hat (mobile Ansicht), andernfalls `false`.
   */
  checkScreenWidth(): boolean {
    return window.matchMedia('(max-width: 700px)').matches;
  }
}
