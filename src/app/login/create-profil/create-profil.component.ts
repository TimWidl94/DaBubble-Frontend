import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-profil.component.html',
  styleUrl: './create-profil.component.scss'
})
export class CreateProfilComponent {

  constructor(private loginService: LoginService){

  }

  avatars:any = [
    "assets/img/avatar/avatar1.svg",
    "assets/img/avatar/avatar2.svg",
    "assets/img/avatar/avatar3.svg",
    "assets/img/avatar/avatar4.svg",
    "assets/img/avatar/avatar5.svg",
    "assets/img/avatar/avatar6.svg",
  ];

  profilPicture: string | ArrayBuffer | null = "assets/img/avatar/avatar_empty.svg";
  selectedImage: string | ArrayBuffer | null = null;


  goToRegestration(){
    this.loginService.setRegistrationScreen(true);
    this.loginService.setProfilScreen(false);
  }

  changeProfilPicture(imagePath: string){
    if(this.profilPicture == imagePath){
    this.profilPicture = "assets/img/avatar/avatar_empty.svg";}
    else{ this.profilPicture = imagePath;}
  }

  goToLogin(){
    this.loginService.setProfilScreen(false);
    this.loginService.setLoginScreen(true);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = e.target?.result as string | ArrayBuffer | null;
        this.profilPicture = this.selectedImage;
      };

      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
