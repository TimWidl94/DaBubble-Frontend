import { MessageService } from './../../../services/message.service';
import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/users.service';
import { ReactionBoxComponent } from './reaction-box/reaction-box.component';
import { ThreadService } from '../../../services/thread.service';
import { MainContentComponent } from '../../main-content.component';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ChatSectionComponent } from '../chat-section.component';
import { EmojiReactionComponent } from '../../../shared/emoji/emoji-reaction/emoji-reaction.component';
import { MediaChangeViewService } from '../../../services/media-change-view.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    ReactionBoxComponent,
    FormsModule,
    EmojiReactionComponent,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor(
    private usersService: UsersService,
    private threadService: ThreadService,
    private mainContentComponent: MainContentComponent,
    private messageService: MessageService,
    private mediaChangeService: MediaChangeViewService
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
    this.usersService.loadUserFromToken();
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
            this.mediaChangeService.setThreadScreenMobile(true);
          }
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


  autoResize(event: any) {
    const textArea = event.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  editMessage() {
    this.messageContent = this.message.content;
    this.isEditingMessage = true;
  }

  saveMessage() {
    let content: string = this.messageContent;
    let emojiData = this.message;
    this.messageService
      .updateMessage(this.message.channel, this.message.id, content, emojiData)
      .subscribe(
        (response) => {
          console.log('message wurde geupdated:', response);
          this.isEditingMessage = false;
          this.messageService.getMessages(this.message.channel);
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

  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
  }

  getMediaUrl(filePath: string): string {
    return `http://localhost:8000${filePath}`;
  }

  getShortFileName(filePath: string): string {
    if (!filePath) return '';

    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];

    return fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase();
  }
}
