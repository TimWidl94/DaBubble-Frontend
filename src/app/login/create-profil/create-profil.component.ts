import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-profil.component.html',
  styleUrl: './create-profil.component.scss'
})
export class CreateProfilComponent {

  constructor(private loginService: LoginService, private authService: AuthService, private router: Router){

  }

  avatars:any = [
    "assets/img/avatar/avatar1.svg",
    "assets/img/avatar/avatar2.svg",
    "assets/img/avatar/avatar3.svg",
    "assets/img/avatar/avatar4.svg",
    "assets/img/avatar/avatar5.svg",
    "assets/img/avatar/avatar6.svg",
  ];

  profilPicture: string = "assets/img/avatar/avatar_empty.svg";
  selectedImage: string | ArrayBuffer | null = null;

  changeProfilPicture(imagePath: string){
    if(this.profilPicture == imagePath){
    this.profilPicture = "assets/img/avatar/avatar_empty.svg";}
    else{ this.profilPicture = imagePath;}
  }

  goToLogin() {
    const { username, email, password } = this.authService.getRegistrationData();
    this.authService.register(username, password, email, this.profilPicture)
      .subscribe(response => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      }, error => {
        console.error('Registration failed', error);
      });
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
  regestrationComplete: boolean = false;

  registrate() {
    this.authService
      .register(this.username, this.password, this.email, this.avatar)
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
