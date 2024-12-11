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
import { ThreadService } from '../../services/thread.service';
import { ProfilInfoService } from '../../services/profil-info.service';
import { NewChannelMemberComponent } from './new-channel-member/new-channel-member.component';
import { ChannelMemberComponent } from './channel-member/channel-member.component';
import { ChannelInfoComponent } from './channel-info/channel-info.component';

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
    private profilInfoService: ProfilInfoService
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
  usersFromChannel: User[] = [];
  chatPartner!: User;
  userId: number | null = null;

  newMessage: string = '';

  messageEmpty: boolean = true;

  messages: any[] = [];

  emoji_list = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗',
  '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥',
  '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔',
  '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨',
  '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒',
  '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🥳'];
  emojiMenuOpen: boolean = false;

  channelNameHovered: boolean = false;
  channelInfoOpen: boolean = false;

  addNewChannelMemberOpen: boolean = false;
  channelMemberOpen: boolean = false;
  profilInformationOpen: boolean = false;

  previousMessagesLength = 0;

  fileName: string = '';
  selectedFile: File | null = null;

  @Input() users: User[] = [];

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt Nachrichten und Benutzer und startet das regelmäßige Überprüfen von neuen Nachrichten.
   */
  ngOnInit(): void {
    this.loadAndCombineMessagesWithUsers();
    this.loadChannel();
    setInterval(() => {
      this.scrollToBottomIfNewMessage();
    }, 1000);
  }

  /**
   * Überprüft, ob sich die Anzahl der Nachrichten geändert hat und scrollt nach unten, wenn neue Nachrichten hinzukamen.
   */
  private scrollToBottomIfNewMessage(): void {
    if (this.messages.length !== this.previousMessagesLength) {
      this.scrollToBottom();
      this.previousMessagesLength = this.messages.length;
    }
  }

  /**
   * Scrolled das Nachrichten-Container-Element nach unten, um die neuesten Nachrichten anzuzeigen.
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
   * Kombiniert die Nachrichten mit den entsprechenden Benutzerinformationen, indem es die Benutzer mit den Nachrichten verbindet.
   */
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

  /**
   * Lädt den aktuellen Kanal und aktualisiert die Anzeige, wenn der Kanal geladen wurde.
   */
  loadChannel() {
    this.channelService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
      this.cdRef.detectChanges();
      if (this.users) {
        this.loadUserFromChannel();
      }
    });
  }

  /**
   * Startet das Polling für Nachrichten des angegebenen Kanals.
   * @param channelId Die ID des Kanals, für den das Polling gestartet werden soll.
   */
  startPolling(channelId: number) {
    this.messageService.startPollingMessages(channelId);
  }

  /**
   * Lädt die Nachrichten für den aktuellen Kanal und gibt diese in der Konsole aus.
   */
  loadMessages() {
    this.messageService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  /**
   * Fügt die entsprechenden Benutzerinformationen zu jeder Nachricht hinzu.
   * @param messages Die Liste von Nachrichten, die bearbeitet werden soll.
   * @param users Die Liste der Benutzer, die den Nachrichten zugeordnet werden.
   * @returns Eine neue Liste von Nachrichten mit den zugehörigen Benutzerinformationen.
   */
  addCorrectUserToMessage(messages: Message[], users: User[]): Message[] {
    return messages.map((message) => {
      const user = users.find((u) => u.id === message.sender);
      return { ...message, user };
    });
  }

  /**
   * Lädt alle Benutzer, die Mitglieder des aktuellen Kanals sind.
   */
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

  /**
   * Wird ausgeführt, wenn der Benutzer den Mauszeiger über den Kanalnamen bewegt oder verlässt.
   * @param isHovered Gibt an, ob der Mauszeiger über dem Kanalnamen schwebt.
   */
  onHover(isHovered: boolean) {
    this.channelNameHovered = isHovered;
  }


  /**
   * Wird ausgeführt, wenn der Benutzer eine Nachricht im Textfeld eingibt.
   * @param message ist die Nachricht das der Benutzer eingibt.
   * Wenn ein Zeichen auser einem Leerzeichen eingegeben wird, wird der Button enabled.
   */
  checkEmptyMessage(message: string){
    if(message.trim().length <= 0){
      this.messageEmpty = true;
    } else {this.messageEmpty = false}
  }

  /**
   * Bereitet die Formulardaten für das Senden einer Nachricht vor, einschließlich Text und Dateien.
   * @returns Ein `FormData`-Objekt, das die Nachrichtendaten enthält.
   */
  getMessageData(): FormData {
    const formData = new FormData();

    // Textdaten hinzufügen
    formData.append('content', this.newMessage);
    formData.append('sender', this.user.id.toString());
    formData.append('channel', this.channel ? this.channel.id.toString() : '0');
    formData.append('timestamp', new Date().toISOString());
    formData.append('thread_channel', '0');

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

  /**
   * Sendet eine Nachricht an den aktuellen Kanal und lädt anschließend die Nachrichten und Benutzer neu.
   */
  sendMessage() {
    let formData = this.getMessageData();

    if (this.channel) {
      this.messageService.sendMessage(this.channel.id, formData).subscribe(
        (response) => {
          this.newMessage = '';
          this.channelService.loadSelectedChannel(this.channel!.id);
          this.messageService.getMessages(this.channel!.id);
          this.loadAndCombineMessagesWithUsers();
        },
        (error) => {
          console.error('Fehler beim Schicken der Nachricht:', error);
        }
      );
    }
  }

  /**
   * Tracking-Funktion für Nachrichten-IDs zur Optimierung der Rendering-Performance.
   * @param index Der Index der Nachricht.
   * @param message Die Nachricht, die getrackt werden soll.
   * @returns Die ID der Nachricht.
   */
  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }

  /**
   * Überprüft, ob eine Nachricht die erste des Tages ist.
   * @param message Die Nachricht, die überprüft werden soll.
   * @param index Der Index der Nachricht in der Nachrichtenliste.
   * @returns `true`, wenn es die erste Nachricht des Tages ist, andernfalls `false`.
   */
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

  /**
   * Gibt das formatierte Datum einer Nachricht basierend auf dem Timestamp zurück.
   * @param timestamp Der Timestamp der Nachricht.
   * @returns Das formatierte Datum.
   */
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

  /**
   * Öffnet das Bearbeitungsmenü für den Kanal.
   */
  openChannelEditMenu() {
    this.channelInfoOpen = !this.channelInfoOpen;
  }

  /**
   * Lädt den Kanal mit der angegebenen Kanal-ID neu.
   * @param channelId Die ID des Kanals, der neu geladen werden soll.
   */
  updateChannel(channelId: number) {
    this.channelService.loadSelectedChannel(channelId);
  }

  /**
   * Öffnet das Menü zum Hinzufügen eines neuen Kanalmitglieds.
   */
  openAddNewChannelMemberOpen() {
    this.addNewChannelMemberOpen = !this.addNewChannelMemberOpen;
  }

  /**
   * Öffnet das Menü für die Kanalmitglieder.
   */
  openChannelMember() {
    this.channelMemberOpen = !this.channelMemberOpen;
  }

  /**
   * Schließt alle geöffneten Komponenten (AddNewChannelMember, ChannelInfo, ChannelMember).
   */
  closeAllComponents() {
    this.addNewChannelMemberOpen = false;
    this.channelInfoOpen = false;
    this.channelMemberOpen = false;
  }

  /**
   * Überprüft, ob der Benutzer ein privater Kanalpartner ist, und setzt die entsprechende `chatPartner`-Variable.
   */
  checkForPrivatChannelPartner() {
    for (let user of this.usersFromChannel) {
      if (user.id != this.user.id) {
        this.chatPartner = user;
      }
      if (this.usersFromChannel.length <= 1 && user.id == this.user.id) {
        this.chatPartner = user;
      }
    }
  }

  /**
   * Öffnet das Profil des angegebenen Benutzers.
   * @param user Der Benutzer, dessen Profil geöffnet werden soll.
   */
  openProfilInformation(user: User) {
    this.profilInfoService.openProfil(user);
  }

  /**
   * Schaltet das Öffnen und Schließen des Profil-Informationsbereichs um.
   */
  closeProfilInformation() {
    this.profilInformationOpen = !this.profilInformationOpen;
  }

  /**
   * Öffnet den Datei-Upload-Dialog für das Hinzufügen von Dateien zu einer Nachricht.
   */
  triggerFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput.click();
  }

  /**
   * Wird aufgerufen, wenn der Benutzer eine Datei auswählt.
   * @param event Das Auswahlereignis für die Datei.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  /**
   * Öffne das Emoji Menü
   */
  toggleEmojiMenu(){
    this.emojiMenuOpen = !this.emojiMenuOpen;
  }


  /**
   * Füge der Nachricht ein Emoji hinzu.
   * @param emoji Das Auwahlergebnis des Emoji aus einer Liste
   */
  addEmoji(emoji: string){
    this.newMessage += emoji;
  }
}
