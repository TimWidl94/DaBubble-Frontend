import { ChannelService } from './../../services/channel.service';
import { UsersService } from './../../services/users.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CreateNewChannelComponent } from '../devspaceSection/create-new-channel/create-new-channel.component';
import { MessageService } from '../../services/message.service';

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
  users: any[] = [];
  showUser: boolean = false;
  openCreateChannel: boolean = false;
  channels: any[] = [];
  channelsOpen: boolean = false;
  activeBox: HTMLElement | null = null;

  ngOnInit(): void {
    this.userService.loadAndCombineUsersAndImages(); // Lädt Benutzer und Bilder und kombiniert sie

    this.userService.allUser$.subscribe((users) => {
      this.users = users;
      this.cdRef.detectChanges(); // View aktualisieren, um neue Daten anzuzeigen
    });

    this.channelService.fetchAllChannel().subscribe((channels) => {
      this.channels = channels;
    });

    this.loadNewChannelOpen();
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
}
