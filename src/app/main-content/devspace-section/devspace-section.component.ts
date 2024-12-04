import { ChannelService } from './../../services/channel.service';
import { UsersService } from './../../services/users.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  input,
  OnInit,
} from '@angular/core';
import { CreateNewChannelComponent } from '../devspaceSection/create-new-channel/create-new-channel.component';
import { MessageService } from '../../services/message.service';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { Message } from '../../models/message.model';
import { SearchbarComponent } from '../header-main-content/searchbar/searchbar.component';
import { MediaChangeViewService } from '../../services/media-change-view.service';

@Component({
  selector: 'app-devspace-section',
  standalone: true,
  imports: [CommonModule, CreateNewChannelComponent, SearchbarComponent],
  templateUrl: './devspace-section.component.html',
  styleUrls: ['./devspace-section.component.scss'],
})
export class DevspaceSectionComponent implements OnInit {
  constructor(
    private userService: UsersService,
    private cdRef: ChangeDetectorRef,
    private channelService: ChannelService,
    private messageService: MessageService,
    private mediaChangeViewService: MediaChangeViewService
  ) {}

  isHoveredChannel: boolean = false;
  isHoveredDirectMessage: boolean = false;
  isHoveredNewChannel: boolean = false;
  // users: User[] = [];
  showUser: boolean = true;
  openCreateChannel: boolean = false;
  channels: Channel[] = [];
  channelsOpen: boolean = true;
  activeBox: HTMLElement | null = null;
  isPrivatChannelExist: boolean = false;
  privateChannelId: number = 0;
  privatChatPartner: User | null = null;

  @Input() user!: User;

  @Input() users: User[] = [];

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt alle Kanäle und überprüft, ob ein neues Kanal-Erstellungsformular geöffnet werden soll.
   */
  ngOnInit(): void {
    this.fetchAllChannel();
    this.loadNewChannelOpen();
  }

  /**
   * Lädt alle Kanäle und speichert sie in der `channels`-Variable.
   * Ruft `detectChanges()` auf, um Änderungen zu erkennen.
   */
  fetchAllChannel() {
    this.channelService.loadAllChannels();
    this.channelService.allChannel$.subscribe((channels) => {
      this.channels = channels;
      this.cdRef.detectChanges();
    });
  }

  /**
   * Öffnet das Formular zum Erstellen eines neuen Kanals.
   */
  newChannelOpen() {
    this.channelService.setcreateChannelScreen(true);
  }

  /**
   * Abonniert die Anzeige für die Kanal-Erstellungsansicht und aktualisiert `openCreateChannel`, wenn der Wert geändert wird.
   */
  loadNewChannelOpen() {
    this.channelService.createChannel$.subscribe((value: boolean | null) => {
      if (value !== null) {
        this.openCreateChannel = value; // Reagiere auf die Änderung
      }
    });
  }

  /**
   * Setzt den Status `isHoveredChannel`, wenn der Mauszeiger über einem Kanal schwebt.
   * @param isHovered Gibt an, ob der Mauszeiger über einem Kanal schwebt.
   */
  onHoverChannel(isHovered: boolean) {
    this.isHoveredChannel = isHovered;
  }

  /**
   * Setzt den Status `isHoveredDirectMessage`, wenn der Mauszeiger über einer Direktnachricht schwebt.
   * @param isHovered Gibt an, ob der Mauszeiger über einer Direktnachricht schwebt.
   */
  onHoverDm(isHovered: boolean) {
    this.isHoveredDirectMessage = isHovered;
  }

  /**
   * Setzt den Status `isHoveredNewChannel`, wenn der Mauszeiger über dem "Neuen Kanal"-Button schwebt.
   * @param isHovered Gibt an, ob der Mauszeiger über dem "Neuen Kanal"-Button schwebt.
   */
  onHoverNewChannel(isHovered: boolean) {
    this.isHoveredNewChannel = isHovered;
  }

  /**
   * Zeigt oder verbirgt den Benutzer in der Benutzeransicht für Direktnachrichten.
   */
  showDmUser() {
    this.showUser = !this.showUser;
  }

  /**
   * Schaltet den Status von `channelsOpen`, um die Kanalliste zu öffnen oder zu schließen.
   */
  toggleChannels() {
    this.channelsOpen = !this.channelsOpen;
  }

  /**
   * Wird ausgeführt, wenn ein Kanal-Element angeklickt wird. Markiert das angeklickte Element als aktiv.
   * @param event Das Klick-Ereignis.
   */
  onBoxClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;

    if (this.activeBox) {
      this.activeBox.classList.remove('active');
    }

    target.classList.add('active');

    this.activeBox = target;
  }

  /**
   * Erstellt einen privaten Kanal mit dem angegebenen Benutzer.
   * @param user Der Benutzer, mit dem der private Kanal erstellt werden soll.
   */
  getPrivatChannelData(user: User) {
    let channelMembers = [];

    channelMembers.push(this.user.id);
    channelMembers.push(user.id);

    let channelData = {
      channelName: user.first_name + ' ' + user.last_name,
      channelDescription: 'Privat Channel',
      channelMembers: channelMembers,
      createdFrom: this.user?.first_name + ' ' + this.user?.last_name,
      privateChannel: true,
    };
    this.createNewChannel(channelData, user);
  }

  /**
   * Öffnet den angegebenen Kanal und lädt die Nachrichten für diesen Kanal.
   * Passt die mobile Ansicht an, wenn der Kanal geöffnet wird.
   * @param channelId Die ID des Kanals, der geöffnet werden soll.
   */
  openChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
    this.messageService.getMessages(channelId);
    this.mediaChangeViewService.setChatScreenMobile(true);
    this.mediaChangeViewService.setDevspaceScreenMobile(false);
    this.mediaChangeViewService.setDevspaceHeaderMobile(true);
    this.mediaChangeViewService.setThreadScreenMobile(false);
  }

  /**
   * Erstellt einen neuen Kanal mit den angegebenen Kanal-Daten und dem angegebenen Benutzer.
   * @param channelData Die Kanal-Daten, die für den neuen Kanal verwendet werden.
   * @param user Der Benutzer, mit dem der Kanal erstellt werden soll.
   */
  createNewChannel(channelData: any, user: User): void {
    this.channelService.createChannel(channelData).subscribe(
      (response) => {
        this.checkIfChannelExist(user);
        this.openChannel(response.id);
      },
      (error) => {
        console.error('Fehler beim Erstellen des Channels:', error);
      }
    );
  }

  /**
   * Überprüft, ob ein Kanal mit dem angegebenen Benutzer bereits existiert.
   * Wenn ja, wird der Kanal geöffnet, andernfalls wird ein neuer Kanal erstellt.
   * @param user Der Benutzer, der überprüft wird.
   * @returns `true`, wenn der Kanal existiert, andernfalls `false`.
   */
  checkIfChannelExist(user: User) {
    this.fetchAllChannel();
    for (let channel of this.channels) {
      if (channel.privateChannel) {
        if (
          this.checkChannelIncludesUser(channel, user) ||
          this.checkIfChannelIncludeSingleUser(channel, user)
        ) {
          this.openChannel(channel.id);
          this.privateChannelId = channel.id;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Überprüft, ob der angegebene Kanal den angegebenen Benutzer enthält.
   * @param channel Der Kanal, der überprüft werden soll.
   * @param user Der Benutzer, der überprüft werden soll.
   * @returns `true`, wenn der Benutzer Mitglied des Kanals ist, andernfalls `false`.
   */
  checkChannelIncludesUser(channel: Channel, user: User) {
    if (
      channel.channelMembers.includes(user.id) &&
      channel.channelMembers.includes(this.user.id) &&
      user.id != this.user.id
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Überprüft, ob der angegebene Kanal nur einen Benutzer (den aktuellen Benutzer) enthält.
   * @param channel Der Kanal, der überprüft werden soll.
   * @param user Der Benutzer, der überprüft werden soll.
   * @returns `true`, wenn der Kanal nur den aktuellen Benutzer und den angegebenen Benutzer enthält, andernfalls `false`.
   */
  checkIfChannelIncludeSingleUser(channel: Channel, user: User) {
    if (
      channel.channelMembers.length <= 1 &&
      channel.channelMembers.includes(user.id) &&
      channel.channelMembers.includes(this.user.id)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Führt die Prüfung durch, ob ein Kanal existiert, und erstellt ihn, falls notwendig.
   * @param user Der Benutzer, mit dem der Kanal überprüft oder erstellt werden soll.
   */
  createAndCheckHelpFunction(user: User) {
    if (this.checkIfChannelExist(user)) {
      this.openChannel(this.privateChannelId);
    }
    if (!this.checkIfChannelExist(user)) {
      this.getPrivatChannelData(user);
    }
  }
}
