import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-header-main-content',
  standalone: true,
  imports: [],
  templateUrl: './header-main-content.component.html',
  styleUrl: './header-main-content.component.scss'
})
export class HeaderMainContentComponent {

  constructor(private authService: AuthService, private uploadService: UploadService) { }

  user: any;
  profil_img: string = 'assets/img/avatar/avatar_empty.svg';

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadUserImages();
  }

  loadUserImages() {
    this.uploadService.getUserImages().subscribe(
      (images: any) => {
        if (images.length > 0) {
          const userImage = images[0]; // assuming one image per user for simplicity
          if (userImage.image) {
            this.profil_img = userImage.image;
          } else if (userImage.image_path) {
            this.profil_img = userImage.image_path;
          }
        }
      },
      (error) => {
        console.error('Error loading user images', error);
      }
    );
  }

}
