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

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, ReactionBoxComponent, CommonModule, FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor(
    private usersService: UsersService,
    private threadService: ThreadService,
    private mainContentComponent: MainContentComponent
  ) {}

  isHovered: boolean = false;
  isEditingMessage: boolean = false;
  messageContent?: string;

  ngOnInit() {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
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

  user: User | null = null;
  threadMessages: Message[] = [];
  lastMessageTime?: string;

  @Input() message: Message = {
    id: 0,
    content: '',
    sender: 0,
    timestamp: '',
    channel: 0,
    thread_channel: 0,
    user: {
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      imagepath: '',
      image: '',
    },
  };

  reactionBox: boolean = false;

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

  editMessage(){
    this.messageContent = this.message.content;
    this.isEditingMessage = true;
  }


  saveMessage(){

  }

  cancelEditing(){
    this.messageContent = this.messageContent;
    this.isEditingMessage = false;
  }
}

