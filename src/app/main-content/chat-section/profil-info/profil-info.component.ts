import { Component, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ChatSectionComponent } from '../chat-section.component';

@Component({
  selector: 'app-profil-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil-info.component.html',
  styleUrl: './profil-info.component.scss'
})
export class ProfilInfoComponent {

  constructor(private chatSection: ChatSectionComponent){

  }

@Input() user: User | null = null;


closeProfilInformation(){
  this.chatSection.openProfilInformation();
}
}
