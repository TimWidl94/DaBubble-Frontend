import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../services/channel.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-create-new-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-channel.component.html',
  styleUrl: './create-new-channel.component.scss',
})
export class CreateNewChannelComponent {
  openChannelBox: boolean = true;
  openEditUserBox: boolean = false;
  selectUser: boolean = false;

  channelName: string = '';
  channelDescription: string = '';
  createdFrom: string = '';
  inputAllMember: boolean = true;
  inputSpecificUsers: boolean = false;
  btnDisabled: boolean = false;
  ifUserIsFind: boolean = false;
  searchUser: string = '';

  searchedUser: any[] = [];

  userImages: any[] = [];

  user: User | null = null;
  allUser: User[] = [];
  specificUser: any[] = [];
  selectedUser: any[] = [];

  topPosition: number = 234;

  constructor(
    private channelService: ChannelService,
    private userService: UsersService,
    private cdRef: ChangeDetectorRef
  ) {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.userService.allUser$.subscribe((users) => {
      this.allUser = users;
    });

    this.calculateTopPosition();
  }

  ngOnChanges() {
    // Neu berechnen, wenn sich selectedUser ändert
    this.calculateTopPosition();
  }

  closeCreateChannelBox() {
    this.channelService.setcreateChannelScreen(false);
  }

  goToEditUser() {
    this.openChannelBox = !this.openChannelBox;
    this.openEditUserBox = !this.openEditUserBox;
    this.checkEnableBtn();
  }

  searchSpecificUser() {
    let searchInput = this.searchUser.trim().toLowerCase();
    this.calculateTopPosition();
    for (let i = 0; i < this.allUser.length; i++) {
      const user = this.allUser[i];
      const isUserSelected = this.selectedUser.some((u) => u.id === user.id);

      if (
        (user.first_name.toLowerCase().includes(searchInput) ||
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
    if (this.searchedUser.length === 0) {
      this.ifUserIsFind = false;
    }
  }

  activateSearchSpecificUser() {
    this.inputAllMember = !this.inputAllMember;
    this.inputSpecificUsers = !this.inputSpecificUsers;
    this.checkEnableBtn();
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
    }
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
      this.topPosition = 234 + height + 20; // 234px ist der ursprüngliche Top-Wert
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

  checkEnableBtn() {
    if (this.selectedUser.length >= 1) {
      this.btnDisabled = true;
    } else if (this.inputAllMember) {
      this.btnDisabled = true;
    } else {
      this.btnDisabled = false;
    }
  }

  //// create new Channel functions  ////

  createNewChannel(): void {
    let channelData = this.getChannelData();

    // Senden der Daten an den Service
    this.channelService.createChannel(channelData).subscribe(
      (response) => {
        console.log('Channel erfolgreich erstellt:', response);
        this.channelService.setcreateChannelScreen(false);
      },
      (error) => {
        console.error('Fehler beim Erstellen des Channels:', error);
      }
    );
  }

  getChannelData() {
    let channelMembers = [];

    if (this.inputAllMember) {
      // Wenn inputAllMember true ist, verwende alle Benutzer
      channelMembers = this.allUser.map((user) => user.id);
    } else if (this.selectedUser.length > 0) {
      // Wenn inputAllMember false ist und mindestens ein Benutzer ausgewählt wurde
      channelMembers = this.selectedUser.map((user) => user.id);
    }

    let channelData = {
      channelName: this.channelName,
      channelDescription: this.channelDescription,
      channelMembers: channelMembers,
      createdFrom: this.user?.first_name + ' ' + this.user?.last_name,
    };

    return channelData;
  }
}
