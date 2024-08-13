import { ChannelService } from './../../services/channel.service';
import { UsersService } from './../../services/users.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CreateNewChannelComponent } from '../devspaceSection/create-new-channel/create-new-channel.component';

@Component({
  selector: 'app-devspace-section',
  standalone: true,
  imports: [CommonModule, CreateNewChannelComponent, CreateNewChannelComponent],
  templateUrl: './devspace-section.component.html',
  styleUrl: './devspace-section.component.scss',
})
export class DevspaceSectionComponent {
  constructor(
    private userService: UsersService,
    private cdRef: ChangeDetectorRef,
    private channelService: ChannelService,
  ) {}

  isHoveredChannel: boolean = false;
  isHoveredDirectMessage: boolean = false;
  users: any[] = [];
  userImages: any[] = [];
  showUser: boolean = true;
  openCreateChannel: boolean = false;

  ngOnInit(): void {
    forkJoin({
      users: this.userService.fetchUsers(),
      userImages: this.userService.fetchUserImage(),
    }).subscribe(({ users, userImages }) => {
      this.users = users;
      this.userImages = userImages;
      this.setUserImageToUser();
      this.loadNewChannelOpen();
    });

    this.userService.allUser$.subscribe((users) => {
      // Abonniere alle Benutzer
      this.users = users;
      if (this.users) {
        this.loadUserImages(); // Lade Benutzerbilder neu, falls nötig
      }
    });
  }

  newChannelOpen() {
    this.channelService.setcreateChannelScreen(true)
  }

  loadNewChannelOpen(){
    this.channelService.createChannel$.subscribe((value: boolean | null) => {
      if (value !== null) {
        this.openCreateChannel = value; // Reagiere auf die Änderung
      }
    });
  }

  loadUser() {
    this.userService.allUser$.subscribe((users) => {
      // Aboniere die Aktuellen allUsers Daten, um aktuelle Werte zu erhalten.
      this.users = users;
      // console.log('Aktueller Benutzer:', this.users);
      if (this.users) {
        console.log('Geladen in Devspace section', this.users);
        this.loadUserImages();
      }
    });
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

  onHoverChannel(isHovered: boolean) {
    this.isHoveredChannel = isHovered;
  }

  onHoverDm(isHovered: boolean) {
    this.isHoveredDirectMessage = isHovered;
  }

  setUserImageToUser() {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
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

  showDmUser() {
    this.showUser = !this.showUser;
  }
}
