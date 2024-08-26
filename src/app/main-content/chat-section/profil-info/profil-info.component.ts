import { Component, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ChatSectionComponent } from '../chat-section.component';

@Component({
  selector: 'app-profil-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil-info.component.html',
  styleUrl: './profil-info.component.scss',
})
export class ProfilInfoComponent {
  constructor(private chatSection: ChatSectionComponent) {}

  @Input() userId: number | null = null;
  @Input() users: User[] = [];
  user: User | null = null;

  ngOnInit() {
    console.log('profil-info:', this.users);
    this.checkForUser();
  }

  closeProfilInformation() {
    this.chatSection.closeProfilInformation();
  }

  checkForUser() {
    for (let user of this.users) {
      if (user.id == this.userId) {
        this.user = user;
      }
    }
  }
}
