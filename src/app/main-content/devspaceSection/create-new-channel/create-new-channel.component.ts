import { CommonModule } from '@angular/common';
import { ChannelService } from '../../../services/channel.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-create-new-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-new-channel.component.html',
  styleUrl: './create-new-channel.component.scss',
})
export class CreateNewChannelComponent {
  constructor(
    private channelService: ChannelService,
    private userService: UsersService,
    private cdRef: ChangeDetectorRef
  ) {}

  openChannelBox: boolean = true;
  openEditUserBox: boolean = false;
  selectUser: boolean = false;

  channelName: string = '';
  channelDescription: string = '';
  inputAllMember: boolean = true;
  inputSpecificUsers: boolean = false;
  btnDisabled: boolean = false;
  ifUserIsFind: boolean = false;
  searchUser: string = '';

  searchedUser: any[] = [];

  userImages: any[] = [];

  allUser: any[] = [];
  specificUser: any[] = [];
  selectedUser: any[] = [];

  topPosition: number = 234;

  ngOnInit() {
    this.userService.allUser$.subscribe((users) => {
      this.allUser = users;
      console.log('Officeteam Member:', this.allUser);
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
  }

  searchSpecificUser() {
    let searchInput = this.searchUser.trim().toLowerCase();

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
    console.log('gefundene Nutzer:', this.searchedUser);
  }

  activateSearchSpecificUser() {
    this.inputAllMember = !this.inputAllMember;
    this.inputSpecificUsers = !this.inputSpecificUsers;
    this.btnDisabled = !this.btnDisabled;
  }

  createNewChannel() {
    console.log(this.channelName);
    console.log(this.channelDescription);
    console.log(this.allUser);
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

  addSelectedUser(user: any[]) {
    if (!this.selectedUser.includes(user)) {
      this.selectedUser.push(user);
      this.calculateTopPosition();
      console.log('selected User hinzugefügt:', this.selectedUser);
      let i = this.searchedUser.indexOf(user);
      if (i !== -1) {
        this.searchedUser.splice(i, 1);
        console.log('User aus searchedUser entfernt:', this.searchedUser);
        if (this.searchedUser.length == 0) {
          this.ifUserIsFind = false;
        }
      }
    }
  }

  calculateTop(length: number) {
    if (length === 0) {
      return 234;
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
      console.log('Höhe:', height);
      this.topPosition = 234 + height + 20; // 234px ist der ursprüngliche Top-Wert, den du anpassen kannst
    }
  }
}
