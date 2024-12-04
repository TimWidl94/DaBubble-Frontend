import { MediaChangeViewService } from './../../services/media-change-view.service';
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
import {
  combineLatest,
  filter,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { User } from '../../models/user.model';
import { Channel } from '../../models/channel.model';
import { ThreadService } from '../../services/thread.service';
import { MainContentComponent } from '../main-content.component';
import { ThreadMessageComponent } from './thread-message/thread-message.component';
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
    ThreadMessageComponent,
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
    private mainContentComponent: MainContentComponent,
    private mediaChangeService: MediaChangeViewService
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

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt den Thread und die zugehörigen Nachrichten.
   */
  ngOnInit(): void {
    this.loadThread();
  }

  /**
   * Wird aufgerufen, wenn die Komponente zerstört wird. Schließt die Beobachtungen und Verhindert Speicherlecks.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Scrollt das Nachrichtencontainer-Element nach unten, sodass die neuesten Nachrichten angezeigt werden.
   * Tritt ein Fehler auf, wird dieser im Konsolen-Log ausgegeben.
   */
  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  /**
   * Lädt den aktuellen Thread und die zugehörigen Nachrichten.
   * Setzt die Thread-Daten und ruft anschließend die Kanalinformationen und Nachrichten ab.
   */
  loadThread(): void {
    this.threadService.thread$
      .pipe(
        takeUntil(this.destroy$),
        filter((thread) => !!thread), // Filtert ungültige Threads
        tap((thread) => {
          this.thread = thread;
          this.channelId = this.getChannelIdFromThread(thread);
          this.threadChannelId = this.getThreadChannelIdFromThread(thread);
          this.loadChannelInformation(this.channelId); // Lädt die Kanalinformationen
        }),
        switchMap(() =>
          this.threadService.getThreadMessages(this.threadChannelId)
        ) // Ruft die Nachrichten ab
      )
      .subscribe((messages) => {
        this.threadMessages = messages;
        if (this.threadMessages) {
          this.loadAndCombineMessagesWithUsers(); // Kombiniert die Nachrichten mit den Benutzern
        }
        this.cdRef.detectChanges(); // Erzeugt die Änderungserkennung
      });
  }

  /**
   * Extrahiert die Kanal-ID aus einem Thread-Objekt.
   * @param thread Das Thread-Objekt.
   * @returns Die Kanal-ID.
   */
  getChannelIdFromThread(thread: any): number {
    return thread.channel;
  }

  /**
   * Extrahiert die Thread-Kanal-ID aus einem Thread-Objekt.
   * @param thread Das Thread-Objekt.
   * @returns Die Thread-Kanal-ID.
   */
  getThreadChannelIdFromThread(thread: any): number {
    return thread.thread_channel;
  }

  /**
   * Lädt die Nachrichten eines bestimmten Kanals und setzt sie in den Zustand der Komponente.
   * @param channelId Die ID des Kanals.
   */
  loadThreadMessages(channelId: number) {
    this.threadService.loadThread(channelId);
    this.threadService.selectedThreadMessages$.subscribe((messages) => {
      this.threadMessages = messages;
    });
  }

  /**
   * Lädt die Kanalinformationen für einen bestimmten Kanal.
   * @param channelId Die ID des Kanals.
   */
  loadChannelInformation(channelId: number) {
    this.channelService.loadChannelForThread(channelId);
    this.channelService.selectedThreadChannel$.subscribe((channel) => {
      this.channel = channel;
    });
  }

  /**
   * Kombiniert Nachrichten mit Benutzerinformationen, indem die Benutzer anhand der Sender-ID zugeordnet werden.
   * @returns Eine Liste von Nachrichten mit den entsprechenden Benutzerobjekten.
   */
  loadAndCombineMessagesWithUsers() {
    combineLatest([
      this.usersService.allUser$,
      this.threadService.selectedThreadMessages$,
    ]).subscribe(([users, messages]) => {
      this.users = users;
      this.threadMessages = this.addCorrectUserToMessage(messages, users); // Fügt die Benutzer zu den Nachrichten hinzu
      this.cdRef.detectChanges(); // Erzeugt die Änderungserkennung
    });
  }

  /**
   * Startet die Polling-Nachrichtenabfrage für einen bestimmten Kanal.
   * @param channelId Die ID des Kanals.
   */
  startPolling(channelId: number) {
    this.messageService.startPollingMessages(channelId);
  }

  /**
   * Fügt den richtigen Benutzer zu jeder Nachricht hinzu.
   * @param messages Eine Liste von Nachrichten.
   * @param users Eine Liste von Benutzern.
   * @returns Eine Liste von Nachrichten mit den zugehörigen Benutzern.
   */
  addCorrectUserToMessage(messages: Message[], users: User[]): Message[] {
    return messages.map((message) => {
      const user = users.find((u) => u.id === message.sender);
      return { ...message, user };
    });
  }

  /**
   * Setzt den Hover-Zustand für den Kanalnamen (z.B. bei Mouseover).
   * @param isHovered Gibt an, ob der Kanalname derzeit überfahren wird.
   */
  onHover(isHovered: boolean) {
    this.channelNameHovered = isHovered;
  }

  /**
   * Bereitet die Nachrichtendaten für das Senden vor (einschließlich Text und Anhänge).
   * @returns FormData-Objekt mit den notwendigen Daten für die Nachricht.
   */
  getMessageData(): FormData {
    const formData = new FormData();

    // Textdaten hinzufügen
    formData.append('content', this.newMessage);
    formData.append('sender', this.user.id.toString());
    formData.append('channel', this.channel ? this.channel.id.toString() : '0');
    formData.append('timestamp', new Date().toISOString());
    formData.append(
      'thread_channel',
      this.threadChannelId ? this.threadChannelId.toString() : '0'
    );

    if (this.selectedFile) {
      formData.append('messageData', this.selectedFile);
    }

    // Emojis (Standardwerte)
    formData.append('emoji_check', JSON.stringify([]));
    formData.append('emoji_handsup', JSON.stringify([]));
    formData.append('emoji_nerd', JSON.stringify([]));
    formData.append('emoji_rocket', JSON.stringify([]));

    return formData;
  }

  /**
   * Sendet eine neue Nachricht an den Thread-Kanal.
   * Verwendet die `getMessageData()` Methode, um die Formulardaten zu erhalten.
   */
  sendMessage(): void {
    let formData = this.getMessageData();

    if (formData) {
      this.threadService
        .sendThreadMessage(this.threadChannelId, formData)
        .subscribe(() => {
          this.newMessage = ''; // Setzt das neue Nachrichteneingabefeld zurück
        });
    }
  }

  /**
   * Hilfsmethode zur Identifizierung einer Nachricht in der Liste anhand ihrer ID.
   * Wird verwendet, um die Nachricht in *ngFor zu tracken.
   * @param index Der Index der Nachricht.
   * @param message Die Nachricht selbst.
   * @returns Die ID der Nachricht.
   */
  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }

  /**
   * Öffnet oder schließt die Ansicht für die Mitglieder des Kanals.
   */
  openChannelMember() {
    this.channelMemberOpen = !this.channelMemberOpen;
  }

  /**
   * Schließt die Thread-Ansicht und setzt das Layout für den mobilen Bildschirm zurück.
   */
  closeThreadSection(): void {
    this.mainContentComponent.threadOpen = false;
    this.mediaChangeService.setThreadScreenMobile(false);
    this.mediaChangeService.setChatScreenMobile(false);
    this.mediaChangeService.setDevspaceScreenMobile(true);
    this.mediaChangeService.setDevspaceHeaderMobile(false);
  }

  /**
   * Öffnet den Datei-Upload Dialog für Nachrichten.
   */
  triggerFileInput() {
    const fileInput = document.getElementById(
      'fileUploadThread'
    ) as HTMLInputElement;
    fileInput.click();
  }

  /**
   * Wird aufgerufen, wenn eine Datei zum Upload ausgewählt wurde.
   * Speichert die ausgewählte Datei und ihren Namen.
   * @param event Das Event, das durch die Dateiauswahl ausgelöst wurde.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }
}
