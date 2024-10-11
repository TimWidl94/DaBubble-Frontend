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
import { SearchbarComponent } from "../header-main-content/searchbar/searchbar.component";
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
    private mediaChangeViewService: MediaChangeViewService,
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

  ngOnInit(): void {
    this.fetchAllChannel();
    this.loadNewChannelOpen();
  }

  fetchAllChannel() {
    this.channelService.loadAllChannels();
    this.channelService.allChannel$.subscribe((channels) => {
      this.channels = channels;
      this.cdRef.detectChanges();
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

  openChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
    this.messageService.getMessages(channelId);
    this.mediaChangeViewService.setChatScreenMobile(true);
    this.mediaChangeViewService.setDevspaceScreenMobile(false);
    this.mediaChangeViewService.setDevspaceHeaderMobile(true);
    this.mediaChangeViewService.setThreadScreenMobile(false);
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

  createAndCheckHelpFunction(user: User) {
    if (this.checkIfChannelExist(user)) {
      this.openChannel(this.privateChannelId);
    }
    if (!this.checkIfChannelExist(user)) {
      this.getPrivatChannelData(user);
    }
  }
}
