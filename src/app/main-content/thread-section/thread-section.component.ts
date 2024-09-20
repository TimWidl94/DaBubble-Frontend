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
import { ChannelInfoComponent } from '../chat-section/channel-info/channel-info.component';
import { NewChannelMemberComponent } from '../chat-section/new-channel-member/new-channel-member.component';
import { ChannelMemberComponent } from '../chat-section/channel-member/channel-member.component';
import { ProfilInfoComponent } from '../chat-section/profil-info/profil-info.component';
import { combineLatest, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { ThreadService } from '../../services/thread.service';
import { MainContentComponent } from '../main-content.component';
import { ThreadMessageComponent } from "./thread-message/thread-message.component";
import { Message } from '../../models/message.model';


@Component({
  selector: 'app-thread-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChannelInfoComponent,
    NewChannelMemberComponent,
    ChannelMemberComponent,
    ProfilInfoComponent,
    ThreadMessageComponent
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

  fileName: string = '';
  selectedFile: File | null = null;

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

  getMessageData(): FormData {
    const formData = new FormData();

    // Textdaten hinzufügen
    formData.append('content', this.newMessage);
    formData.append('sender', this.user.id.toString());
    formData.append('channel', this.channel ? this.channel.id.toString() : '0');
    formData.append('timestamp', new Date().toISOString());
    formData.append('thread_channel', this.threadChannelId ? this.threadChannelId.toString() : '0'); // oder den passenden Wert setzen

    // Datei hinzufügen, falls vorhanden
    if (this.selectedFile) {
        formData.append('messageData', this.selectedFile);
    }

    // Emojis als JSON-String, da FormData nur primitive Datentypen unterstützt
    formData.append('emoji_check', JSON.stringify([]));
    formData.append('emoji_handsup', JSON.stringify([]));
    formData.append('emoji_nerd', JSON.stringify([]));
    formData.append('emoji_rocket', JSON.stringify([]));

    return formData;
}

  sendMessage(): void {
    let formData = this.getMessageData();

    if (formData) {

      this.threadService.sendThreadMessage(this.threadChannelId, formData).subscribe(() => {
        this.newMessage = '';
      });
    }

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

  triggerFileInput() {
    const fileInput = document.getElementById('fileUploadThread') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }
}
