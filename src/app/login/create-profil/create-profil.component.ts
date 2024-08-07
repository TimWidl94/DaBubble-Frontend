import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-create-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-profil.component.html',
  styleUrl: './create-profil.component.scss',
})
export class CreateProfilComponent {
  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private uploadService: UploadService
  ) {}

  avatars: any = [
    'assets/img/avatar/avatar1.svg',
    'assets/img/avatar/avatar2.svg',
    'assets/img/avatar/avatar3.svg',
    'assets/img/avatar/avatar4.svg',
    'assets/img/avatar/avatar5.svg',
    'assets/img/avatar/avatar6.svg',
  ];

  profilPicture: string = 'assets/img/avatar/avatar_empty.svg';
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imagePath: string | null = null;

  changeProfilPicture(imagePath: string) {
    if (this.profilPicture === imagePath) {
      this.profilPicture = 'assets/img/avatar/avatar_empty.svg';
    } else {
      this.profilPicture = imagePath;
      this.imagePath = imagePath;
      this.selectedFile = null;
    }
  }

  goToLogin() {
    const { username, email, password, first_name, last_name } =
      this.authService.getRegistrationData();
    this.authService
      .register(username, password, email, first_name, last_name)
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.authService.setToken(response.token);
          this.uploadImage();
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
  }

  uploadImage() {
    const fd = new FormData();
    if (this.selectedFile) {
      fd.append('image', this.selectedFile, this.selectedFile.name);
    } else if (this.imagePath) {
      fd.append('image_path', this.imagePath);
    }
    this.uploadService.uploadImage(fd).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/login']);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.imagePath = null;
    } else {
      this.selectedFile = null;
    }
  }

  goToRegestration() {
    this.router.navigate(['/regestration']);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilPicture = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput() {
    document.getElementById('fileUpload')?.click();
  }

  username: string = '';
  password: string = '';
  email: string = '';
  avatar: string = '';
  first_name: string = '';
  last_name: string = '';
  regestrationComplete: boolean = false;

  registrate() {
    this.authService
      .register(
        this.username,
        this.password,
        this.email,
        this.first_name,
        this.last_name
      )
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.regestrationComplete = true;
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
  }
}
