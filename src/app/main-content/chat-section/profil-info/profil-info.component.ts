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

  ngOnInit() {
    this.profilInfoService.userProfile$.subscribe((user: User) => {
      // Diese Methode wird aufgerufen, sobald neue Daten verfügbar sind
      this.user = user;
      this.openProfilInformation(user);
    });
  }

  closeProfilInformation() {
    this.profilInfoOpen = !this.profilInfoOpen;
  }

  openProfilInformation(user: User) {
    this.profilInfoOpen = !this.profilInfoOpen;
    // Hier kannst du die Logik zum Öffnen des Profils implementieren
  }

  openChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
    this.messageService.getMessages(channelId);
    this.profilInfoOpen = !this.profilInfoOpen;
  }

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
