import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ProfilInfoService } from '../../../services/profil-info.service';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.model';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-profil-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil-info.component.html',
  styleUrl: './profil-info.component.scss',
})
export class ProfilInfoComponent {
  constructor(
    private profilInfoService: ProfilInfoService,
    private channelService: ChannelService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  user!: User;
  channels: Channel[] = [];
  privateChannelId: number = 0;

  profilInfoOpen: boolean = false;

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Abonniert den `userProfile$` Observable-Stream des `profilInfoService` und lädt die Profildaten des Benutzers.
   */
  ngOnInit() {
    this.profilInfoService.userProfile$.subscribe((user: User) => {
      // Diese Methode wird aufgerufen, sobald neue Daten verfügbar sind
      this.user = user;
      this.openProfilInformation(user);
    });
  }

  /**
   * Schaltet das Öffnen und Schließen der Profildaten um.
   */
  closeProfilInformation() {
    this.profilInfoOpen = !this.profilInfoOpen;
  }

  /**
   * Öffnet die Profildaten des Benutzers.
   * @param user Der Benutzer, dessen Profil geöffnet werden soll.
   */
  openProfilInformation(user: User) {
    this.profilInfoOpen = !this.profilInfoOpen;
    // Hier kannst du die Logik zum Öffnen des Profils implementieren
  }

  /**
   * Öffnet den Kanal basierend auf der Kanal-ID.
   * Lädt die Nachrichten für den Kanal.
   * @param channelId Die ID des Kanals, der geöffnet werden soll.
   */
  openChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
    this.messageService.getMessages(channelId);
    this.profilInfoOpen = !this.profilInfoOpen;
  }

  /**
   * Überprüft, ob bereits ein Kanal für den Benutzer existiert, andernfalls wird ein neuer Kanal erstellt.
   * @param user Der Benutzer, mit dem der private Kanal erstellt oder überprüft werden soll.
   */
  createAndCheckHelpFunction(user: User) {
    if (this.checkIfChannelExist(user)) {
      this.channelService.loadAllChannels();
      this.openChannel(this.privateChannelId);
      console.log('geöffneter Nutzer:', user);
    }
    if (!this.checkIfChannelExist(user)) {
      this.getPrivatChannelData(user);
    }
  }

  /**
   * Überprüft, ob ein privater Kanal für den Benutzer bereits existiert.
   * Falls der Kanal existiert, wird er geöffnet, andernfalls wird `false` zurückgegeben.
   * @param user Der Benutzer, dessen privaten Kanal überprüft werden soll.
   * @returns Gibt `true` zurück, wenn der Kanal existiert, andernfalls `false`.
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
   * Lädt alle Kanäle vom Server und aktualisiert die `channels`-Liste.
   */
  fetchAllChannel() {
    this.channelService.loadAllChannels();
    this.channelService.allChannel$.subscribe((channels) => {
      this.channels = channels;
      if (this.channels) {
        // console.log(this.channels)
      }
      this.cdRef.detectChanges();
    });
  }

  /**
   * Erstellt die Daten für einen privaten Kanal zwischen dem aktuellen Benutzer und dem angegebenen Benutzer.
   * Ruft anschließend die Methode `createNewChannel` auf, um den Kanal zu erstellen.
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
   * Erstellt einen neuen Kanal mit den übergebenen Kanal-Daten.
   * Ruft die Methode `checkIfChannelExist` auf, um den Kanal zu prüfen, und öffnet den Kanal nach der Erstellung.
   * @param channelData Die Daten des zu erstellenden Kanals.
   * @param user Der Benutzer, mit dem der Kanal erstellt wird.
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
   * Überprüft, ob der Kanal den angegebenen Benutzer sowie den aktuellen Benutzer als Mitglieder enthält.
   * @param channel Der Kanal, der überprüft werden soll.
   * @param user Der Benutzer, der im Kanal überprüft werden soll.
   * @returns Gibt `true` zurück, wenn der Benutzer im Kanal ist, andernfalls `false`.
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
   * Überprüft, ob der Kanal nur den angegebenen Benutzer als Mitglied enthält und ob dieser Kanal privat ist.
   * @param channel Der Kanal, der überprüft werden soll.
   * @param user Der Benutzer, der im Kanal überprüft werden soll.
   * @returns Gibt `true` zurück, wenn der Kanal nur den angegebenen Benutzer enthält und privat ist, andernfalls `false`.
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
}
