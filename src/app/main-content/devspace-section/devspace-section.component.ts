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
    private messageService: MessageService,
  ) {}

  isHoveredChannel: boolean = false;
  isHoveredDirectMessage: boolean = false;
  isHoveredNewChannel: boolean = false;
  // users: User[] = [];
  showUser: boolean = false;
  openCreateChannel: boolean = false;
  channels: Channel[] = [];
  channelsOpen: boolean = false;
  activeBox: HTMLElement | null = null;
  isPrivatChannelExist: boolean = false;
  privateChannelId: number = 0 ;
  privatChatPartner: User | null = null;

  @Input() user: User = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    imagepath: '',
    image: '',
  };

  @Input() users: User [] = [];

  ngOnInit(): void {
    // this.userService.loadAndCombineUsersAndImages(); // Lädt Benutzer und Bilder und kombiniert sie

    // this.userService.allUser$.subscribe((users) => {
      // this.users = users;
      // this.cdRef.detectChanges(); // View aktualisieren, um neue Daten anzuzeigen
    // });
    this.fetchAllChannel();

    this.loadNewChannelOpen();
    // console.log(this.user);
  }

  fetchAllChannel() {
    this.channelService.fetchAllChannel().subscribe((channels) => {
      this.channels = channels;
      // console.log(this.channels);
    });
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

  openPrivatChannel(channelId: number) {
    this.channelService.loadSelectedPrivatChannel(channelId);
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
        // console.log('Channel erfolgreich erstellt:', response);
        this.fetchAllChannel();
        // console.log(
          // 'channels nach dem erstellen eines privat channels:',
          // this.channels
        // );
        this.checkIfChannelExist(user);
      },
      (error) => {
        console.error('Fehler beim Erstellen des Channels:', error);
      }
    );
  }

  checkIfChannelExist(user: User) {
    for (let channel of this.channels) {
      if (channel.privateChannel) {
        if (
          channel.channelMembers.includes(user.id) &&
          channel.channelMembers.includes(this.user.id)
        ) {
          // console.log('channel exisitert');
          this.openChannel(channel.id);
          this.privateChannelId = channel.id;
          console.log('privatChatPartner:',this.privatChatPartner);
          return true;
        }
      }
    }
    return false;
  }

  createAndCheckHelpFunction(user:User){
    if(this.checkIfChannelExist(user)){
      this.openChannel(this.privateChannelId);
      console.log('geöffneter Nutzer:',user);
    } if(!this.checkIfChannelExist(user)){
      this.getPrivatChannelData(user);
    }


  }

}
