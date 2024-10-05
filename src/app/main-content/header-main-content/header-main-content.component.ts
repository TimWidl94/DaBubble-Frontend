import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { SearchbarComponent } from "./searchbar/searchbar.component";
import { MediaChangeViewService } from '../../services/media-change-view.service';

@Component({
  selector: 'app-header-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchbarComponent],
  templateUrl: './header-main-content.component.html',
  styleUrls: ['./header-main-content.component.scss'],
})
export class HeaderMainContentComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private uploadService: UploadService,
    private router: Router,
    private userService: UsersService,
    private mediaChangeViewService: MediaChangeViewService,
    private cdRef: ChangeDetectorRef,
  ) {}

  // user: User | null = null;
  profil_img: string = 'assets/img/avatar/avatar_empty.svg';
  menuOpen: boolean = false;
  profilOpen: boolean = false;
  profilEditOpen: boolean = false;
  fullName: string = '';
  first_name: string = '';
  last_name: string = '';
  name: string = '';
  email: string = '';

  @Input() users: User[] = [];
  @Input() user!:User;

  devspaceMobileOn:boolean = false;

  ngOnInit() {
    this.userService.loadUserImage();
    this.loadUserImages();
    this.loadDevspaceHeaderMobile();
  }

  loadDevspaceHeaderMobile(){
    this.mediaChangeViewService.headerDevspaceMobileOn$.subscribe((headerDevspaceMobileOn) => {
      this.devspaceMobileOn = headerDevspaceMobileOn;
      this.cdRef.detectChanges();
    })
  }

  loadUserImages() {
    this.userService.userImage$.subscribe((image) => {
      if (image) {
        this.profil_img = image.image ? image.image : image.image_path;
      }
    });
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
  }

  closeEditProfilInformation() {
    this.profilEditOpen = !this.profilEditOpen;
  }

  async editUserInformation() {
    this.splitFullName(this.fullName);
    const updatedUser = {
      ...this.user,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.user?.email,
    };
    this.authService.updateUser(updatedUser).subscribe(
      (response) => {
        this.userService.loadUserFromToken();
        this.userService.loadAndCombineUsersAndImages();
        this.profilEditOpen = false;
      },
      (e) => {
        console.error('Fehler beim Aktualisieren des Benutzers', e);
      }
    );
  }

  splitFullName(fullName: string) {
    let nameParts = fullName.trim().split(' ');
    this.first_name = nameParts[0];
    this.last_name = nameParts.slice(1).join(' ');
  }

  getFullName() {
    return this.user ? `${this.user.first_name} ${this.user.last_name}` : '';
  }

  closeHeaderMenus() {
    this.profilOpen = false;
    this.profilEditOpen = false;
    this.menuOpen = false;
  }

  backToDevspaceMobile(){
    this.mediaChangeViewService.setChatScreenMobile(false);
    this.mediaChangeViewService.setDevspaceScreenMobile(true);
    this.mediaChangeViewService.setDevspaceHeaderMobile(false);
  }

  closeEditUser(){
    this.profilEditOpen = false;
    this.profilOpen = true;
  }
}
