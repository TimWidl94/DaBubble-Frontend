import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-new-emoji',
  standalone: true,
  imports: [],
  templateUrl: './new-emoji.component.html',
  styleUrl: './new-emoji.component.scss'
})
export class NewEmojiComponent {

  @Input() message!: Message;
  @Input() user: User | null = null;

  constructor(private messageService: MessageService){}

  sendEmoji(emojiType: string) {
    let emoji = emojiType;
    let messageEmoji = `emoji_${emoji}`;
    let index = this.message[messageEmoji].indexOf(this.user);
    if (index > -1) {
      this.message[messageEmoji].splice(index, 1);
    } else {
      this.message[messageEmoji].push(this.user);
    }
    this.messageService.updateMessageEmojis(this.message.channel, this.message.id, this.message).subscribe(response => {
      console.log('Emoji updated:', response);
    }, error => {
      console.error('error updating emoji', error)
    })
  }
}
