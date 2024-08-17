import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor() {}

  @Input() message: Message = {
    id: 0,
    content: '',
    sender: 0,
    timestamp: '',
    channel: 0,
    user: {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      imagepath: '',
      image: ''
    } // Optionales User-Feld
  }; // Default-Wert

  getTimeFromTimestamp(): string {
    if (!this.message.timestamp) {
      return '';
    }

    const date = new Date(this.message.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}
