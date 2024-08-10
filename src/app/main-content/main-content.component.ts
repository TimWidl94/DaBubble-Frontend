import { UsersService } from './../services/users.service';
import { Component } from '@angular/core';
import { HeaderMainContentComponent } from './header-main-content/header-main-content.component';
import { DevspaceSectionComponent } from './devspace-section/devspace-section.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderMainContentComponent, DevspaceSectionComponent, CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {

  constructor(private userService: UsersService){}

  isHoveredDevspaceClose: boolean = false;
  isHoveredDevspaceOpen: boolean = false;
  menuIconOpen: string = 'assets/icons/open_devspace_black.svg';
  menuIconClose: string = "assets/icons/close_devspace_black.svg";
  devspaceOpen:boolean = true;
  users: any[] = []


  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }

  onHoverDevspace(isHovered: boolean) {
    this.isHoveredDevspaceClose = isHovered;
    if (!this.isHoveredDevspaceClose) {
      this.menuIconOpen = 'assets/icons/open_devspace_black.svg';
      this.menuIconClose = 'assets/icons/close_devspace_black.svg'
    } else {
      this.menuIconOpen = 'assets/icons/open_devspace_blue.svg';
      this.menuIconClose = 'assets/icons/close_devspace_blue.svg'
    }
  }

  closeDevspace() {
      this.devspaceOpen = !this.devspaceOpen;
  }
}
