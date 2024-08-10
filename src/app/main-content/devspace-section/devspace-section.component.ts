import { UsersService } from './../../services/users.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-devspace-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devspace-section.component.html',
  styleUrl: './devspace-section.component.scss',
})
export class DevspaceSectionComponent {
  constructor(private userService: UsersService, private cdRef: ChangeDetectorRef) {}

  isHoveredChannel: boolean = false;
  isHoveredDirectMessage: boolean = false;
  users: any[] = [];
  userImages: any[] = [];
  showUser:boolean = true;

  ngOnInit(): void {
    forkJoin({
      users: this.userService.fetchUsers(),
      userImages: this.userService.fetchUserImage()
    }).subscribe(({ users, userImages }) => {
      this.users = users;
      this.userImages = userImages;
      this.setUserImageToUser();
    });
  }

  loadUsers() {
    if (this.userService.getUsers().length === 0) {
      this.userService.fetchUsers().subscribe((data) => {
        this.users = data;
        console.log(this.users);
      });
    } else {
      this.users = this.userService.getUsers();
    }
  }

  loadUserImages() {
    if (this.userService.getUsersImages().length === 0) {
      this.userService.fetchUserImage().subscribe((data) => {
        this.userImages = data;
        console.log(this.userImages);
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
        if(userid == userImgId){
          user.imagepath = userImage.image_path;
          user.image = userImage.image;
          console.log('nach Bild zuweisung:',this.users)
        }
      }
    }
    this.cdRef.detectChanges();
  }

  showDmUser(){
    this.showUser = !this.showUser;
  }
}
