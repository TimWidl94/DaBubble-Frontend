import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactionBoxComponent } from '../../chat-section/message/reaction-box/reaction-box.component';
import { FormsModule } from '@angular/forms';
import { EmojiReactionComponent } from '../../../shared/emoji/emoji-reaction/emoji-reaction.component';
import { UsersService } from '../../../services/users.service';
import { ThreadService } from '../../../services/thread.service';
import { MainContentComponent } from '../../main-content.component';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.model';
import { Message } from '../../../models/message.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-thread-message',
  standalone: true,
  imports: [CommonModule, ReactionBoxComponent, FormsModule, EmojiReactionComponent],
  templateUrl: './thread-message.component.html',
  styleUrl: './thread-message.component.scss'
})
export class ThreadMessageComponent {
  constructor(
    private usersService: UsersService,
    private threadService: ThreadService,
    private mainContentComponent: MainContentComponent,
    private messageService: MessageService
  ) {}

  isHovered: boolean = false;
  isEditingMessage: boolean = false;
  messageContent!: string;

  [key: string]: any;

  userId?: number;
  user: User | null = null;
  threadMessages: Message[] = [];
  lastMessageTime?: string;

  @Input() message!: Message;

  reactionBox: boolean = false;

  ngOnInit() {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
      this.userId = this.user?.id;
    });
    if (this.message.thread_channel) {
      this.loadThreadMessages(this.message.thread_channel).subscribe(
        (messages) => {
          this.threadMessages = messages;
          if (this.threadMessages.length != 0) {
            this.getLastMessageTime();
          }
        }
      );
    }

    // console.log('geladener User:', this.user)
    // console.log(this.message);
  }

  getTimeFromTimestamp(): string {
    if (!this.message.timestamp) {
      return '';
    }

    const date = new Date(this.message.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  hovered(isHovered: boolean) {
    if (this.user?.id !== this.message.user?.id) {
      this.isHovered = isHovered;
    }
  }

  showReactionBox(isHovered: boolean) {
    this.reactionBox = !this.reactionBox;
  }

  openThread() {
    this.threadService
      .openThread(this.message.channel, this.message.id)
      .subscribe(
        (response) => {
          if (response.id) {
            this.threadService.threadSubject.next(response);
            this.mainContentComponent.threadOpen = true;
          }
          // console.log('Thread created/loaded reactionBox:', response);
        },
        (error) => {
          console.error('Error creating thread:', error);
        }
      );
  }

  loadThreadMessages(threadChannelId: number): Observable<Message[]> {
    return this.threadService.getThreadMessages(threadChannelId);
  }

  getLastMessageTime() {
    const lastMessage = this.threadMessages[this.threadMessages.length - 1];
    const date = new Date(lastMessage.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    this.lastMessageTime = `${hours}:${minutes}`;
  }

  getInformation() {
    console.log(this.message);
    console.log(this.threadMessages);
  }

  autoResize(event: any) {
    const textArea = event.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  editMessage() {
    this.messageContent = this.message.content;
    this.isEditingMessage = true;
  }

  saveThreadMessage() {
    let content: string = this.messageContent;
    this.threadService
      .updateThreadMessage(this.message.channel, this.message.id, content)
      .subscribe(
        (response) => {
          console.log('message wurde geupdated:', response);
          this.isEditingMessage = false;
          this.threadService.getThreadMessages(this.message.channel);
        },
        (error) => {
          console.error('error updating message:', error);
        }
      );
  }

  cancelEditing() {
    this.messageContent = this.messageContent;
    this.isEditingMessage = false;
  }
}
