import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { UsersService } from '../../services/users.service';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../chat-section/message/message.component';
import { ChannelInfoComponent } from '../chat-section/channel-info/channel-info.component';
import { NewChannelMemberComponent } from '../chat-section/new-channel-member/new-channel-member.component';
import { ChannelMemberComponent } from '../chat-section/channel-member/channel-member.component';
import { ProfilInfoComponent } from '../chat-section/profil-info/profil-info.component';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { Message } from '../../models/message.model';
import { ThreadService } from '../../services/thread.service';


@Component({
  selector: 'app-thread-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageComponent,
    ChannelInfoComponent,
    NewChannelMemberComponent,
    ChannelMemberComponent,
    ProfilInfoComponent,
  ],
  templateUrl: './thread-section.component.html',
  styleUrl: './thread-section.component.scss',
})
export class ThreadSectionComponent {
  constructor(
    private channelService: ChannelService,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private threadService: ThreadService
  ) {}

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  userId: number | null = null;
  thread: any[] = [];
  channelId!: number;
  threadMessages: Message[] = [];
  channel: Channel | null = null;

  newMessage: string = '';

  channelNameHovered: boolean = false;
  channelInfoOpen: boolean = false;

  addNewChannelMemberOpen: boolean = false;
  channelMemberOpen: boolean = false;
  profilInformationOpen: boolean = false;

  previousMessagesLength = 0;

  private destroy$: Subject<void> = new Subject<void>();

  @Input() users: User[] = [];

  @Input() user!: User;

  ngOnInit(): void {
    this.loadThread();
    console.log('thread-section: ', this.thread);
    // setInterval(() => {
    // this.scrollToBottomIfNewMessage();
    // }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // private scrollToBottomIfNewMessage(): void {
    // if (this.messages.length !== this.previousMessagesLength) {
      // this.scrollToBottom();
      // this.previousMessagesLength = this.messages.length;
    // }
  // }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  loadThread() {
    this.threadService.thread$
      .pipe(
        takeUntil(this.destroy$),
        filter((thread) => !!thread)
      )
      .subscribe((thread) => {
        this.thread = thread;
        this.cdRef.detectChanges();
        this.channelId = this.getChannelIdFromThread(thread);
        console.log('thread-section thread:',this.thread);
        this.loadChannelInformation(this.channelId);
        this.loadThreadMessages(this.channelId);
        this.threadService.getThreadMessages(this.channelId);
      });
  }

  getChannelIdFromThread(thread: any): number {
    return thread.channel;
  }

  loadThreadMessages(channelId:number){
    this.threadService.loadThread(channelId)
    this.threadService.selectedThreadMessages$.subscribe((messages) => {
      this.threadMessages = messages;
    })
  }

  loadChannelInformation(channelId:number){
    this.channelService.loadChannelForThread(channelId)
    this.channelService.selectedThreadChannel$.subscribe((channel) => {
      this.channel = channel;
      console.log('thread-section channel: ', this.channel);
    })
  }

  // loadAndCombineMessagesWithUsers() {
  //   combineLatest([
  //     this.usersService.allUser$,
  //     this.threadService.thread$,
  //   ]).subscribe(([users, messages]) => {
  //     this.users = users;
  //     this.messages = this.addCorrectUserToMessage(messages, users);
  //     this.cdRef.detectChanges();
  //     // console.log('loadAndCombine:', this.messages);
  //   });
  // }

  startPolling(channelId: number) {
    this.messageService.startPollingMessages(channelId);
  }

  addCorrectUserToMessage(messages: Message[], users: User[]): Message[] {
    return messages.map((message) => {
      const user = users.find((u) => u.id === message.sender);
      return { ...message, user }; // Fügt den Benutzer als `user`-Feld hinzu
    });
  }

  onHover(isHovered: boolean) {
    this.channelNameHovered = isHovered;
  }

  sendMessage(){
    this.sendMessageInThread(this.channelId);
  }

  sendMessageInThread(threadChannelId: number) {
    let messageData = this.newMessage;
    this.threadService.sendThreadMessage(threadChannelId, messageData).subscribe(
      (response) => {
        console.log('Message sent in thread:', response);
        this.thread.push(response);
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error sending message in thread:', error);
      }
    );
  }


  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }

  openChannelEditMenu() {
    this.channelInfoOpen = !this.channelInfoOpen;
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

  openProfilInformation(channelMemberId: number) {
    this.userId = channelMemberId;
    this.profilInformationOpen = !this.profilInformationOpen;
  }

  closeProfilInformation() {
    this.profilInformationOpen = !this.profilInformationOpen;
  }
}
