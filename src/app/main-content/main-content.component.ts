import { UsersService } from './../services/users.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderMainContentComponent } from './header-main-content/header-main-content.component';
import { DevspaceSectionComponent } from './devspace-section/devspace-section.component';
import { CommonModule } from '@angular/common';
import { ChatSectionComponent } from './chat-section/chat-section.component';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ThreadSectionComponent } from "./thread-section/thread-section.component";
import { ProfilInfoComponent } from "./chat-section/profil-info/profil-info.component";


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeaderMainContentComponent,
    DevspaceSectionComponent,
    CommonModule,
    ChatSectionComponent,
    ThreadSectionComponent,
    ProfilInfoComponent
],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
  ) {}

  isHoveredDevspaceClose: boolean = false;
  isHoveredDevspaceOpen: boolean = false;
  menuIconOpen: string = 'assets/icons/open_devspace_black.svg';
  menuIconClose: string = 'assets/icons/close_devspace_black.svg';
  devspaceOpen: boolean = true;
  users: User[] = [];
  chatChannelOpen: boolean = true;
  user!: User;
  threadOpen:boolean = false;

  ngOnInit(): void {
    this.authService.getActuellUser();
    this.user = this.authService.getUser();
    this.loadUsers();
  }


  loadUsers(){
    this.userService.allUser$.subscribe((users) => {
      this.users = users;
      this.cdRef.detectChanges();
    });
  }



  onHoverDevspace(isHovered: boolean) {
    this.isHoveredDevspaceClose = isHovered;
    if (!this.isHoveredDevspaceClose) {
      this.menuIconOpen = 'assets/icons/open_devspace_black.svg';
      this.menuIconClose = 'assets/icons/close_devspace_black.svg';
    } else {
      this.menuIconOpen = 'assets/icons/open_devspace_blue.svg';
      this.menuIconClose = 'assets/icons/close_devspace_blue.svg';
    }
  }

  closeDevspace() {
    this.devspaceOpen = !this.devspaceOpen;
  }

  openThread(){
    this.threadOpen = !this.threadOpen;
  }
}
