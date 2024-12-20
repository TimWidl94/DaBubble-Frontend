import { Component, Input } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../models/user.model';
import { MainContentComponent } from '../../../main-content.component';
import { ThreadService } from '../../../../services/thread.service';
import { CommonModule } from '@angular/common';

import { ThreadMessageComponent } from '../../thread-message/thread-message.component';
import { MessageThread } from '../../../../models/messageThread.model';
import { Message } from '../../../../models/message.model';

@Component({
  selector: 'app-thread-reaction-box',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './thread-reaction-box.component.html',
  styleUrl: './thread-reaction-box.component.scss'
})
export class ThreadReactionBoxComponent {
  @Input() threadMessage!: Message;
  user: User | null = null;
  loggedInUser: boolean = false;
  editMessageBox: boolean = false;
  hoveredReactionEmoji: boolean = false;
  hoveredMessageEmoji: boolean = false;
  threadId: number = 0;

  constructor(
    private usersService: UsersService,
    private threadService: ThreadService,
    private threadMessageComponent: ThreadMessageComponent
  ) {}

  ngOnInit() {
    this.checkIfMessageUser();
  }

  checkIfMessageUser() {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
    });
    if (this.user!.id == this.threadMessage.sender) {
      this.loggedInUser = !this.loggedInUser;
    }
  }

  isHoveredEditMessageBox(hovered: boolean) {
    this.editMessageBox = hovered;
  }

  isHoveredReactionEmoji(hovered: boolean) {
    this.hoveredReactionEmoji = hovered;
  }

  isHoveredMessageEmoji(hovered: boolean) {
    this.hoveredMessageEmoji = hovered;
  }

  editingThreadMessage() {
    this.threadMessageComponent.editMessage();
  }

  sendEmoji(emojiType: string) {

    let emoji = emojiType;
    let messageEmoji = `emoji_${emoji}`;
    let index = this.threadMessage[messageEmoji].indexOf(this.user);
    if (index > -1) {
      this.threadMessage[messageEmoji].splice(index, 1);
    } else {
      this.threadMessage[messageEmoji].push(this.user);
    }
    this.threadService.updateThreadMessageEmojis(this.threadMessage.thread_channel, this.threadMessage.id, this.threadMessage).subscribe(response => {
    }, error => {
      console.error('error updating emoji', error)
    })
  }
}
