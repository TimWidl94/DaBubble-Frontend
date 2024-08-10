import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-main-content.component.html',
  styleUrl: './header-main-content.component.scss',
})
export class HeaderMainContentComponent {
  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  user: any;
  profil_img: string = 'assets/img/avatar/avatar_empty.svg';
  menuOpen: boolean = false;
  profilOpen: boolean = false;

  async ngOnInit() {
    this.authService.getActuellUser();
    this.user = this.authService.getUser();
    this.loadUserImages();
  }

  loadUserImages() {
    this.uploadService.getUserImages().subscribe(
      (images: any) => {
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const userImage = images[i];
            if (userImage.image && this.user.user_id == userImage.user) {
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

  openProfil(){
    this.profilOpen = !this.profilOpen;
    if(this.menuOpen){
      this.menuOpen = !this.menuOpen;
    }
  }
}
