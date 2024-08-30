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
import { combineLatest, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { Message } from '../../models/message.model';
import { ThreadService } from '../../services/thread.service';
import { MainContentComponent } from '../main-content.component';


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
    private threadService: ThreadService,
    private mainContentComponent: MainContentComponent
  ) {}

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  userId: number | null = null;
  thread: any[] = [];
  channelId!: number;
  threadMessages: Message[] = [];
  channel: Channel | null = null;
  threadChannelId!: number;


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
    // console.log('thread-section: ', this.thread);
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

  loadThread(): void {
    this.threadService.thread$
      .pipe(
        takeUntil(this.destroy$),
        filter((thread) => !!thread),
        tap((thread) => {
          this.thread = thread;
          this.channelId = this.getChannelIdFromThread(thread);
          this.threadChannelId = this.getThreadChannelIdFromThread(thread);
          this.loadChannelInformation(this.channelId);
        }),
        switchMap(() => this.threadService.getThreadMessages(this.threadChannelId))
      )
      .subscribe((messages) => {
        this.threadMessages = messages;
        if(this.threadMessages){
          this.loadAndCombineMessagesWithUsers();
        }
        this.cdRef.detectChanges();
      });
  }

  getChannelIdFromThread(thread: any): number {
    return thread.channel;
  }

  getThreadChannelIdFromThread(thread: any): number {
    return thread.thread_channel;
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
      // console.log('thread-section channel: ', this.channel);
    })
  }

  loadAndCombineMessagesWithUsers() {
    combineLatest([
      this.usersService.allUser$,
      this.threadService.selectedThreadMessages$,
    ]).subscribe(([users, messages]) => {
      this.users = users;
      this.threadMessages = this.addCorrectUserToMessage(messages, users);
      this.cdRef.detectChanges();
      // console.log('loadAndCombine:', this.threadMessages);
    });
  }

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

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.threadService.sendThreadMessage(this.threadChannelId, this.newMessage)
        .subscribe(() => {
          this.newMessage = '';
        });
    }
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

  openChannelMember() {
    this.channelMemberOpen = !this.channelMemberOpen;
  }

  closeThreadSection(): void {
    this.mainContentComponent.threadOpen = false;
  }
}
