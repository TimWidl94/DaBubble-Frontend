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

import { Observable } from 'rxjs';
import { Message } from '../../../models/message.model';
import { ThreadReactionBoxComponent } from './thread-reaction-box/thread-reaction-box.component';


@Component({
  selector: 'app-thread-message',
  standalone: true,
  imports: [CommonModule, ReactionBoxComponent, FormsModule, EmojiReactionComponent, ThreadReactionBoxComponent],
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

  @Input() threadMessage!: Message;

  reactionBox: boolean = false;

  ngOnInit() {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
      this.userId = this.user?.id;
    });
    if (this.threadMessage.thread_channel) {
      this.loadThreadMessages(this.threadMessage.thread_channel).subscribe(
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
    if (!this.threadMessage.timestamp) {
      return '';
    }

    const date = new Date(this.threadMessage.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  hovered(isHovered: boolean) {
    if (this.user?.id !== this.threadMessage.user?.id) {
      this.isHovered = isHovered;
    }
  }

  showReactionBox(isHovered: boolean) {
    this.reactionBox = !this.reactionBox;
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
    console.log(this.threadMessage);
    // console.log(this.threadMessages);
  }

  autoResize(event: any) {
    const textArea = event.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  editMessage() {
    this.messageContent = this.threadMessage.content;
    this.isEditingMessage = true;
  }

  saveThreadMessage() {
    console.log('thread-message message:',this.threadMessage)
    let content: string = this.messageContent;
    this.threadService
      .updateThreadMessage(this.threadMessage.thread_channel, this.threadMessage.id, content)
      .subscribe(
        (response) => {
          console.log('message wurde geupdated:', response);
          this.isEditingMessage = false;
          this.threadService.loadThread(this.threadMessage.thread_channel);
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

  isImage(fileUrl: string | null): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const fileExtension = fileUrl?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
  }

  getMediaUrl(filePath: string | null): string {
    return `http://localhost:8000${filePath}`;  // Port und Base URL anpassen
  }

  getShortFileName(filePath: string | null): string {
    if (!filePath) return ''; // Sicherstellen, dass filePath nicht leer ist

    // Extrahiere den Dateinamen vom Pfad
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];

    // Stelle sicher, dass der Dateiname klein geschrieben ist
    return fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase();
  }
}
