import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component';
import { combineLatest } from 'rxjs';
import { ChannelInfoComponent } from './channel-info/channel-info.component';
import { NewChannelMemberComponent } from './new-channel-member/new-channel-member.component';
import { ChannelMemberComponent } from './channel-member/channel-member.component';
import { ProfilInfoComponent } from "./profil-info/profil-info.component";
import { ThreadService } from '../../services/thread.service';
import { MainContentComponent } from '../main-content.component';

@Component({
  selector: 'app-chat-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageComponent,
    ChannelInfoComponent,
    NewChannelMemberComponent,
    ChannelMemberComponent,
    ProfilInfoComponent
],
  templateUrl: './chat-section.component.html',
  styleUrl: './chat-section.component.scss',
})
export class ChatSectionComponent {
  constructor(
    private channelService: ChannelService,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private threadService: ThreadService,
  ) {
    this.usersService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  user!: User;
  channel: Channel | null = null;
  // users: User[] = [];
  usersFromChannel: User[] = [];
  chatPartner: User | null = null;
  userId: number | null = null;

  newMessage: string = '';

  messages: any[] = [];

  channelNameHovered: boolean = false;
  channelInfoOpen: boolean = false;

  addNewChannelMemberOpen: boolean = false;
  channelMemberOpen: boolean = false;
  profilInformationOpen: boolean = false;

  previousMessagesLength = 0;

  @Input() users: User[] = [];

  ngOnInit(): void {
    this.channelService.loadSelectedChannel(1);
    this.messageService.getMessages(1);

    this.loadAndCombineMessagesWithUsers();
    this.loadChannel();
    setInterval(() => {
      this.scrollToBottomIfNewMessage();
    }, 1000);
  }

  private scrollToBottomIfNewMessage(): void {
    if (this.messages.length !== this.previousMessagesLength) {
      this.scrollToBottom();
      this.previousMessagesLength = this.messages.length;
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  loadAndCombineMessagesWithUsers() {
    combineLatest([
      this.usersService.allUser$,
      this.messageService.messages$,
    ]).subscribe(([users, messages]) => {
      this.users = users;
      this.messages = this.addCorrectUserToMessage(messages, users);
      this.cdRef.detectChanges();
    });
  }

  loadChannel() {
    this.channelService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
      this.cdRef.detectChanges();
      if (this.users) {
        this.loadUserFromChannel();
      }
    });
  }

  startPolling(channelId: number) {
    this.messageService.startPollingMessages(channelId);
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
      return { ...message, user };
    });
  }

  loadUserFromChannel() {
    if (this.channel && this.channel.channelMembers) {
      this.usersFromChannel = [];
      for (let user of this.users) {
        if (this.channel.channelMembers.includes(user.id)) {
          this.usersFromChannel.push(user);
        }
      }
    }
    this.checkForPrivatChannelPartner();
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

  isFirstMessageOfDay(message: Message, index: number): boolean {
    if (index === 0) {
      return true;
    }

    let currentMessageDate = new Date(message.timestamp).setHours(0, 0, 0, 0);
    let previousMessageDate = new Date(
      this.messages[index - 1].timestamp
    ).setHours(0, 0, 0, 0);

    return currentMessageDate !== previousMessageDate;
  }

  getFormattedDate(timestamp: string): string {
    let today = new Date();
    let date = new Date(timestamp);
    let options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    if (today.getDate() === date.getDate()) {
      return 'Heute';
    }

    return date.toLocaleDateString('de-DE', options);
  }

  openChannelEditMenu() {
    this.channelInfoOpen = !this.channelInfoOpen;
    console.log(this.channel);
  }

  updateChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
  }

  openAddNewChannelMemberOpen() {
    this.addNewChannelMemberOpen = !this.addNewChannelMemberOpen;
  }

  openChannelMember() {
    this.channelMemberOpen = !this.channelMemberOpen;
  }

  closeAllComponents() {
    this.addNewChannelMemberOpen = false;
    this.channelInfoOpen = false;
    this.channelMemberOpen = false;
    this.profilInformationOpen = false;
  }

  checkForPrivatChannelPartner(){
    for(let user of this.usersFromChannel){
      if(user.id != this.user.id){
        this.chatPartner = user;
      } if(this.usersFromChannel.length <= 1 && user.id == this.user.id){
        this.chatPartner = user;
      }
    }
  }

  openProfilInformation(channelMemberId:number){
    this.userId = channelMemberId;
    this.profilInformationOpen = !this.profilInformationOpen;
  }

  closeProfilInformation(){
    this.profilInformationOpen = !this.profilInformationOpen;
  }
}
