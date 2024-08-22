import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Channel } from '../../../models/channel.model';
import { User } from '../../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { ChatSectionComponent } from '../chat-section.component';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-new-channel-member',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-channel-member.component.html',
  styleUrl: './new-channel-member.component.scss',
})
export class NewChannelMemberComponent {
  constructor(
    private userService: UsersService,
    private cdRef: ChangeDetectorRef,
    private chatSection: ChatSectionComponent,
    private channelService: ChannelService
  ) {}

  ifUserIsFind: boolean = false;
  searchUser: string = '';
  searchedUser: any[] = [];
  topPosition: number = 180;
  selectedUser: any[] = [];
  newAllUserFromChannel: any[] = [];
  userImages: any[] = [];
  btnDisabled: boolean = false;

  @Input() channel: Channel = {
    id: 0,
    channelName: '',
    channelDescription: '',
    channelMembers: [],
    messages: [],
    createdFrom: '',
  };

  @Input() allUser: User[] = [];

  ngOnInit() {
    // console.log(this.allUser);
    // console.log(this.channel);
  }

  searchSpecificUser() {
    let searchInput = this.searchUser.trim().toLowerCase();
    console.log(searchInput);
    this.calculateTopPosition();
    for (let i = 0; i < this.allUser.length; i++) {
      let user = this.allUser[i];
      let isUserSelected = this.selectedUser.some((u) => u.id === user.id);
      if (this.checkIfUserIsAlreadySelected(user.id)) {
        if (
          ((user.first_name.toLowerCase().includes(searchInput) &&
            !isUserSelected) ||
            user.last_name.toLowerCase().includes(searchInput)) &&
          !isUserSelected
        ) {
          if (!this.searchedUser.some((u) => u.id === user.id)) {
            this.ifUserIsFind = true;
            this.searchedUser.push(user);
            this.loadUserImages();
          }
        } else {
          // Wenn der Benutzer nicht mehr passt oder ausgewählt ist, entfernen
          this.searchedUser = this.searchedUser.filter((u) => u.id !== user.id);
        }
      }
    }
    if (this.searchedUser.length === 0 || searchInput == '') {
      this.ifUserIsFind = false;
    }
  }

  checkIfUserIsAlreadySelected(userId: number) {
    for (let i = 0; i < this.channel.channelMembers.length; i++) {
      let channelMember = this.channel.channelMembers[i];
      if (channelMember === userId) {
        return false;
      }
    }
    return true;
  }

  calculateTop(length: number) {
    if (length === 0) {
      return 290;
    } else if (length > 0 && length <= 3) {
      return 300;
    } else if (length > 3 && length <= 9) {
      return 366;
    } else {
      // Für jedes zusätzliche Intervall von 6 Benutzern +60px hinzufügen
      return 66 + Math.floor((length - 1) / 3) * 66;
    }
  }

  calculateTopPosition() {
    const selectedUserBox = document.querySelector('.selected-user-box');
    if (selectedUserBox) {
      const height = selectedUserBox.clientHeight;
      this.topPosition = 180 + height + 20; // 180px ist der ursprüngliche Top-Wert
    }
  }

  setUserImageToUser() {
    for (let i = 0; i < this.allUser.length; i++) {
      const user = this.allUser[i];
      let userid = user.id;
      for (let x = 0; x < this.userImages.length; x++) {
        const userImage = this.userImages[x];
        let userImgId = userImage.user;
        if (userid == userImgId) {
          user.imagepath = userImage.image_path;
          user.image = userImage.image;
        }
      }
    }
    this.cdRef.detectChanges();
  }

  loadUserImages() {
    if (this.userService.getUsersImages().length === 0) {
      this.userService.fetchUserImage().subscribe((data) => {
        this.userImages = data;
        this.setUserImageToUser();
      });
    } else {
      this.userImages = this.userService.getUsersImages();
      this.setUserImageToUser();
    }
  }

  async addSelectedUser(user: any[]) {
    if (!this.selectedUser.includes(user)) {
      await this.selectedUser.push(user);
      this.calculateTopPosition();
      this.ifUserIsFind = false;
      this.searchUser = '';
      this.checkEnableBtn();
      let i = this.searchedUser.indexOf(user);
      if (i !== -1) {
        this.searchedUser.splice(i, 1);
        if (this.searchedUser.length == 0) {
          this.ifUserIsFind = false;
        }
      }
      this.mergeChannelMember();
    }
  }

  checkEnableBtn() {
    if (this.selectedUser.length >= 1) {
      this.btnDisabled = true;
    } else {
      this.btnDisabled = false;
    }
  }

  removeSelectedUser(user: any[]) {
    let i = this.selectedUser.indexOf(user);
    if (i !== -1) {
      this.selectedUser.splice(i, 1);
      this.calculateTopPosition();
      this.checkEnableBtn();
    }
  }

  closeAddNewMember() {
    this.chatSection.addNewChannelMemberOpen = false;
  }

  mergeChannelMember() {
    for (let i = 0; i < this.channel.channelMembers.length; i++) {
      let channelMember = this.channel.channelMembers[i];
      this.newAllUserFromChannel.push(channelMember);
    }
    for (let x = 0; x < this.selectedUser.length; x++) {
      let channelMember = this.selectedUser[x];
      this.newAllUserFromChannel.push(channelMember.id);
    }
  }

  async addChannelMember(){
    let updatedChannelMembers = {
      ... this.channel,
      channelMembers: this.newAllUserFromChannel
    }
    let channelId = this.channel.id;
    console.log('geupdatede Channelmember:',updatedChannelMembers);
    this.channelService.updateChannel(updatedChannelMembers, channelId).subscribe(
      (response) => {
        console.log(response);
        this.chatSection.updateChannel(this.channel.id);
        this.closeAddNewMember();
        this.searchedUser = [];
      }
    )
  }

}
