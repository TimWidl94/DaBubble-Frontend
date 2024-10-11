import { UsersService } from './../services/users.service';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { HeaderMainContentComponent } from './header-main-content/header-main-content.component';
import { DevspaceSectionComponent } from './devspace-section/devspace-section.component';
import { CommonModule } from '@angular/common';
import { ChatSectionComponent } from './chat-section/chat-section.component';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ThreadSectionComponent } from "./thread-section/thread-section.component";
import { ProfilInfoComponent } from "./chat-section/profil-info/profil-info.component";
import { MediaChangeViewService } from '../services/media-change-view.service';
import { MessageService } from '../services/message.service';
import { ChannelService } from '../services/channel.service';


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
    private mediaChangeViewService: MediaChangeViewService,
    private channelService: ChannelService,
    private messageService: MessageService
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

  isMobileView: boolean = false;

  devspaceMediaOpen: boolean = true;
  chatMediaOpen: boolean = false;
  threadMediaOpen: boolean = false;

  ngOnInit(): void {
    this.authService.getActuellUser();
    this.user = this.authService.getUser();
    this.loadUsers();
    this.isMobileView = this.checkScreenWidth();
    this. loadMobileChannelBooleans();
    this.channelService.loadSelectedChannel(1);
    this.messageService.getMessages(1);
  }


  loadUsers(){
    this.userService.allUser$.subscribe((users) => {
      this.users = users;
      this.cdRef.detectChanges();
    });
  }

  loadMobileChannelBooleans(){
    this.mediaChangeViewService.devspaceScreen$.subscribe((mobileView) =>{
      this.devspaceMediaOpen = mobileView;
      this.cdRef.detectChanges();
    })
    this.mediaChangeViewService.chatScreen$.subscribe((mobileView) =>{
      this.chatMediaOpen = mobileView;
      this.cdRef.detectChanges();
    })
    this.mediaChangeViewService.threadScreen$.subscribe((mobileView) =>{
      this.threadMediaOpen = mobileView;
      this.cdRef.detectChanges();
    })
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobileView = this.checkScreenWidth();
  }

  checkScreenWidth(): boolean {

    return window.matchMedia('(max-width: 700px)').matches;
  }
}
