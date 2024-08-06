import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-main-content',
  standalone: true,
  imports: [],
  templateUrl: './header-main-content.component.html',
  styleUrl: './header-main-content.component.scss'
})
export class HeaderMainContentComponent {

  constructor(private authService: AuthService) { }

  profil_img:string = '';
  user: any;

  ngOnInit() {
    this.user = this.authService.getUser();
  }

}
