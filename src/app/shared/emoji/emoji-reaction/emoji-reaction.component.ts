import { ThreadService } from './../../../services/thread.service';
import { Component, Input, input } from '@angular/core';
import { Message } from '../../../models/message.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { MessageService } from '../../../services/message.service';
import { NewEmojiComponent } from "../new-emoji/new-emoji.component";

@Component({
  selector: 'app-emoji-reaction',
  standalone: true,
  imports: [CommonModule, NewEmojiComponent],
  templateUrl: './emoji-reaction.component.html',
  styleUrl: './emoji-reaction.component.scss',
})
export class EmojiReactionComponent {
  [key: string]: any;

  @Input() message!: Message;
  @Input() user: User | null = null;

  userId?: number;

  emojiCheckHovered: boolean = false;
  emojiHandsUpHovered: boolean = false;
  emojiRocketHovered: boolean = false;
  emojiNerdHovered: boolean = false;

  newEmojiHovered: boolean = false;

  constructor(private messageService: MessageService, private threadService: ThreadService){

  }

  ngOnInit() {
    this.userId = this.user?.id
  }

  hoverEmoji(isHovered: boolean, emoji: string) {
    let emojiName = `emoji${emoji}Hovered`;
    this[emojiName] = isHovered;
  }

  checkThreadOrMessage(emojiType: string){
    if(this.message.threadOpen){
      this.sendEmoji(emojiType);
    } else{ this.saveEmojiThread(emojiType)}
  }


  sendEmoji(emojiType: string) {
    let emoji = emojiType;
    let messageEmoji = `emoji_${emoji}`;
    let index = this.message[messageEmoji].findIndex(
      (user: User) => user.id === this.user!.id
    );
    if (index > -1) {
      this.message[messageEmoji].splice(index, 1);
    } else {
      this.message[messageEmoji].push(this.user);
    }
    this.messageService
      .updateMessageEmojis(this.message.channel, this.message.id, this.message)
      .subscribe(
        (response) => {
          console.log('Emoji updated:', response);
        },
        (error) => {
          console.error('error updating emoji', error);
        }
      );
  }

  saveEmojiThread(emojiType: string){
    let emoji = emojiType;
    let messageEmoji = `emoji_${emoji}`;
    let index = this.message[messageEmoji].findIndex(
      (user: User) => user.id === this.user!.id
    );
    if (index > -1) {
      this.message[messageEmoji].splice(index, 1);
    } else {
      this.message[messageEmoji].push(this.user);
    }
    this.threadService
      .updateThreadMessageEmojis(this.message.thread_channel, this.message.id, this.message)
      .subscribe(
        (response) => {
          console.log('Emoji updated:', response);
        },
        (error) => {
          console.error('error updating emoji', error);
        }
      );
  }

  hoverNewEmojiBox(isHovered: boolean){
    this.newEmojiHovered = isHovered;
  }
}
