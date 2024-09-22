import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.model';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  searchInput: string = '';
  channels: Channel[] = [];

  searchedUser: User[] = [];
  searchedChannel: Channel[] = [];
  privateChannelId: number = 0;

  @Input() users: User[] = [];
  @Input() user!: User;

  constructor(
    private channelService: ChannelService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchAllChannel();
    // console.log(this.users);
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

  search() {
    let searchInputUntrimmed = this.searchInput;
    let searchInput = searchInputUntrimmed.toLowerCase().trim();
    this.searchForUser(searchInput);
    this.searchForChannel(searchInput);
  }

  searchForUser(searchInput: string){
    this.searchedUser = [];
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (
        (user.first_name.toLowerCase().includes(searchInput) &&
          searchInput != '') ||
        (user.last_name.toLowerCase().includes(searchInput) &&
          searchInput != '')
      ) {
        this.searchedUser.push(user);
        console.log('gefundener User:', this.searchedUser);
      }
    }
  }

  searchForChannel(searchInput: string){
    this.searchedChannel = [];
    for (let i = 0; i < this.channels.length; i++) {
      const channel = this.channels[i];
      if (
        (channel.channelName.toLowerCase().includes(searchInput) &&
          searchInput != '')
      ) {
        this.searchedChannel.push(channel);
        console.log('gefundener Channel:', this.searchedChannel);
      }
    }
  }

  checkIfChannelExist(user: User) {
    for (let channel of this.channels) {
      if (channel.privateChannel) {
        if (
          this.checkChannelIncludesUser(channel, user) ||
          this.checkIfChannelIncludeSingleUser(channel, user)
        ) {
          this.openChannel(channel.id);
          this.privateChannelId = channel.id;
          this.searchedChannel = [];
          this.searchedUser = [];
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

  openChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
    this.messageService.getMessages(channelId);
  }
}
