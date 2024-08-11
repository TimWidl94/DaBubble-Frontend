import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-main-content.component.html',
  styleUrl: './header-main-content.component.scss',
})
export class HeaderMainContentComponent {
  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router,
    private userService: UsersService,
  ) {}

  user: any;
  profil_img: string = 'assets/img/avatar/avatar_empty.svg';
  menuOpen: boolean = false;
  profilOpen: boolean = false;
  profilEditOpen: boolean = false;
  fullName: string = '';
  first_name: string = '';
  last_name: string = '';

  name: string = '';
  email: string = '';

  async ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      // console.log('Aktueller Benutzer:', this.user);
      if (this.user) {
        console.log('Aktueller Benutzer:', this.user);
        this.loadUserImages();
      }
    });
    this.authService.getActuellUser();
    this.user = this.authService.getUser();
  }

  loadUserImages() {
    this.uploadService.getUserImages().subscribe(
      (images: any) => {
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const userImage = images[i];
            if (userImage.image && this.user.id == userImage.user) {
              this.profil_img = userImage.image;
            } else if (
              userImage.image_path &&
              this.user.user_id == userImage.user
            ) {
              this.profil_img = userImage.image_path;
            }
          }
        }
      },
      (error) => {
        console.error('Error loading user images', error);
      }
    );
  }

  openHeaderMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login');
    } catch (e) {
      alert('Logout fehlgeschlagen');
      console.error(e);
    }
  }

  openProfil() {
    this.profilOpen = !this.profilOpen;
    if (this.menuOpen) {
      this.menuOpen = !this.menuOpen;
    }
  }

  openEditProfilInformation() {
    this.openProfil();
    this.profilEditOpen = !this.profilEditOpen;
    this.fullName = this.getFullName();
    console.log(this.fullName);
  }

  async editUserInformation() {
    this.splitFullName(this.fullName);
    const updatedUser = {
      ...this.user,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.user.email,
    };
    this.authService.updateUser(updatedUser).subscribe(
      (response) => {
        console.log('Benutzer aktualisiert:', response);
        this.userService.loadUserFromToken(); // Lade die aktualisierten Benutzerdaten neu
        this.userService.loadAllUser(); // Optional: Wenn du alle Benutzer aktualisieren möchtest
        this.profilEditOpen = false;
      },
      (e) => {
        console.error('Updating user dont work', e);
      }
    );
  }

  splitFullName(fullName: string) {
    let nameParts = fullName.trim().split(' ');
    this.first_name = nameParts[0];
    this.last_name = nameParts.slice(1).join(' ');
  }

  getFullName() {
    return this.user.first_name + ' ' + this.user.last_name;
  }
}
