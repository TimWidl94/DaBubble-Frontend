import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.model';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { ProfilInfoService } from '../../../services/profil-info.service';

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
    private messageService: MessageService,
    private profilInfoService: ProfilInfoService
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

  searchForUser(searchInput: string) {
    this.searchedUser = [];

    let searchTerms = searchInput.toLowerCase().trim().split(' ');

    for (let i = 0; i < this.users.length; i++) {
        let user = this.users[i];
        let firstName = user.first_name.toLowerCase();
        let lastName = user.last_name.toLowerCase();

        if (searchTerms.length === 1) {
            if ((firstName.includes(searchTerms[0]) || lastName.includes(searchTerms[0])) && searchInput !== '') {
                this.searchedUser.push(user);
            }
        }

        else if (searchTerms.length >= 2) {
            let firstNameMatch = firstName.includes(searchTerms[0]);
            let lastNameMatch = lastName.includes(searchTerms[1]);
            if (firstNameMatch && lastNameMatch) {
                this.searchedUser.push(user);
            }
        }
    }
}

  searchForChannel(searchInput: string) {
    this.searchedChannel = [];
    for (let i = 0; i < this.channels.length; i++) {
      let channel = this.channels[i];
      if (
        channel.channelName.toLowerCase().includes(searchInput) &&
        searchInput != ''
      ) {
        this.searchedChannel.push(channel);
      }
    }
  }

  checkIfChannelAndUserSame(channelName: string) {
    for (let i = 0; i < this.searchedUser.length; i++) {
      let user = this.searchedUser[i];
      let userNameLC = user.username.toLowerCase();
      let channelNameLC = channelName.replace(/\s+/g, '').toLowerCase();
      if (userNameLC == channelNameLC) {
        return false;
      }
    }
    return true;
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
          this.clearSearch();
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
    this.searchedChannel = [];
    this.searchedUser = [];
    this.searchInput = '';
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

  openProfilInformation(user: User) {
    this.profilInfoService.openProfil(user);
    this.clearSearch();
  }

  clearSearch() {
    this.searchedChannel = [];
    this.searchedUser = [];
    this.searchInput = '';
  }
}
