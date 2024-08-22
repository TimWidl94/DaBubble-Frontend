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

@Component({
  selector: 'app-devspace-section',
  standalone: true,
  imports: [CommonModule, CreateNewChannelComponent],
  templateUrl: './devspace-section.component.html',
  styleUrls: ['./devspace-section.component.scss'],
})
export class DevspaceSectionComponent implements OnInit {
  constructor(
    private userService: UsersService,
    private cdRef: ChangeDetectorRef,
    private channelService: ChannelService,
    private messageService: MessageService
  ) {}

  isHoveredChannel: boolean = false;
  isHoveredDirectMessage: boolean = false;
  isHoveredNewChannel: boolean = false;
  users: User[] = [];
  showUser: boolean = false;
  openCreateChannel: boolean = false;
  channels: Channel[] = [];
  privatChannels: Channel[] = [];
  channelsOpen: boolean = false;
  activeBox: HTMLElement | null = null;

  @Input() user: User = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    imagepath: '',
    image: '',
  };

  ngOnInit(): void {
    this.userService.loadAndCombineUsersAndImages(); // Lädt Benutzer und Bilder und kombiniert sie

    this.userService.allUser$.subscribe((users) => {
      this.users = users;
      this.cdRef.detectChanges(); // View aktualisieren, um neue Daten anzuzeigen
    });

    this.channelService.fetchAllChannel().subscribe((channels) => {
      this.channels = channels;
    });

    this.channelService.fetchPrivatChannel().subscribe((privatChannels) => {
      this.privatChannels = privatChannels;
      if (this.privatChannels) {
        console.log('devspace:', this.privatChannels);
      }
    });

    this.loadNewChannelOpen();
    console.log(this.user);
  }

  newChannelOpen() {
    this.channelService.setcreateChannelScreen(true);
  }

  loadNewChannelOpen() {
    this.channelService.createChannel$.subscribe((value: boolean | null) => {
      if (value !== null) {
        this.openCreateChannel = value; // Reagiere auf die Änderung
      }
    });
  }

  onHoverChannel(isHovered: boolean) {
    this.isHoveredChannel = isHovered;
  }

  onHoverDm(isHovered: boolean) {
    this.isHoveredDirectMessage = isHovered;
  }

  onHoverNewChannel(isHovered: boolean) {
    this.isHoveredNewChannel = isHovered;
  }

  showDmUser() {
    this.showUser = !this.showUser;
  }

  toggleChannels() {
    this.channelsOpen = !this.channelsOpen;
  }

  openChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
    this.messageService.getMessages(channelId);
  }

  onBoxClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;

    if (this.activeBox) {
      this.activeBox.classList.remove('active');
    }

    target.classList.add('active');

    this.activeBox = target;
  }

  createPrivatChannel(user: User): void {
    if (!this.checkIfPrivatChannelExist(user)) {
      let privateChannelData = this.getPrivatChannelData(user);

      this.channelService
        .createPrivateChannel(privateChannelData)
        .subscribe((response) => {
          console.log('Privater Channel erfolgreich erstellt:', response);
        });
    } else {
      let channelId = this.checkIfPrivatChannelExist(user);
      if(channelId){
        this.openChannel(channelId);
      }
      console.log(channelId);
    }
  }

  getPrivatChannelData(user: User) {
    let channelMembers = [];
    channelMembers.push(this.user.id);
    channelMembers.push(user.id);
    // console.log(channelMembers);
    let channelData = {
      channelName: 'PrivatChannel',
      channelDescription: 'this is a privat Channel',
      channelMembers: channelMembers,
      createdFrom: this.user.first_name + ' ' + this.user.last_name,
    };
    // console.log(channelData);
    return channelData;
  }

  checkIfPrivatChannelExist(user: User) {
    for (let channel of this.privatChannels) {
      // Prüfe, ob der Kanal genau 2 Mitglieder hat
      if (channel.channelMembers.length === 2) {
        // Sortiere die Mitglieder-IDs im Kanal
        const sortedMemberIds = channel.channelMembers.sort((a, b) => a - b);
        // Sortiere die zu prüfenden IDs (this.user.id und userId)
        const sortedGivenIds = [this.user.id, user.id].sort((a, b) => a - b);

        // Vergleiche die sortierten Arrays
        if (
          sortedMemberIds[0] === sortedGivenIds[0] &&
          sortedMemberIds[1] === sortedGivenIds[1]
        ) {
          console.log('Channel found with ID:', channel.id);
          return channel.id; // Kanal mit den gleichen Mitgliedern gefunden, gib die channel.id zurück
        }
      }
    }
    // Kein übereinstimmender Kanal gefunden
    console.log('No matching channel found');
    return false; // Gib null zurück, wenn kein Kanal gefunden wurde
  }
}
