import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-chat-section',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chat-section.component.html',
  styleUrl: './chat-section.component.scss',
})
export class ChatSectionComponent {
  constructor(
    private channelService: ChannelService,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  user!: User;
  channel: Channel | null = null;
  users: User[] = [];
  usersFromChannel: User[] = [];

  newMessage: string = '';

  messages: any[] = [];

  channelNameHovered: boolean = false;

  ngOnInit(): void {
    this.channelService.loadSelectedChannel(3);
    this.messageService.getMessages(3);
    this.usersService.loadAndCombineUsersAndImages();

    this.loadAndCombineMessagesWithUsers();
    this.loadChannel();
  }

  loadAndCombineMessagesWithUsers() {
    combineLatest([
      this.usersService.allUser$,
      this.messageService.messages$,
    ]).subscribe(([users, messages]) => {
      this.users = users;
      this.messages = this.addCorrectUserToMessage(messages, users);
      this.cdRef.detectChanges();
      console.log('loadAndCombine:', this.messages);
    });
  }

  loadChannel() {
    this.channelService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
      if (this.users) {
        this.loadUserFromChannel();
      }
    });
  }

  loadMessages() {
    this.messageService.messages$.subscribe((messages) => {
      this.messages = messages;
      if (this.messages) {
        console.log('Nachrichten aus dem geladenen Channel:', this.messages);
      }
    });
  }

  addCorrectUserToMessage(messages: Message[], users: User[]): Message[] {
    return messages.map((message) => {
      const user = users.find((u) => u.id === message.sender);
      return { ...message, user }; // Fügt den Benutzer als `user`-Feld hinzu
    });
  }

  loadUserFromChannel() {
    this.usersFromChannel = [];
    if (this.channel && this.channel.channelMembers) {
      for (const user of this.users) {
        if (this.channel.channelMembers.includes(user.id)) {
          this.usersFromChannel.push(user);
        }
      }
      console.log('Users vom Channel:', this.usersFromChannel);
    }
  }

  onHover(isHovered: boolean) {
    this.channelNameHovered = isHovered;
  }

  getMessageData() {
    let messageData = {
      channel: this.channel,
      content: this.newMessage,
      sender: this.user.first_name + ' ' + this.user.last_name,
    };
    return messageData;
  }

  sendMessage() {
    let messageData = this.getMessageData();

    if (this.channel) {
      this.messageService.sendMessage(this.channel.id, messageData).subscribe(
        (response) => {
          console.log('Nachricht erfolgreich übermittelt:', response);
          this.newMessage = '';
          this.channelService.loadSelectedChannel(this.channel!.id);
          this.messageService.getMessages(this.channel!.id);
          this.loadAndCombineMessagesWithUsers();
        },
        (error) => {
          console.error('Fehler beim schicken der Nachricht:', error);
        }
      );
    }
  }

  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }
}
