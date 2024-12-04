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
  imports: [
    CommonModule,
    ReactionBoxComponent,
    FormsModule,
    EmojiReactionComponent,
    ThreadReactionBoxComponent,
  ],
  templateUrl: './thread-message.component.html',
  styleUrl: './thread-message.component.scss',
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

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt den aktuellen Benutzer und die Nachrichten des Thread-Kanals, wenn ein Thread vorhanden ist.
   */
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

  /**
   * Konvertiert den Zeitstempel einer Nachricht in ein Stunden:Minuten-Format.
   * @returns Die Zeit im Format "HH:mm".
   */
  getTimeFromTimestamp(): string {
    if (!this.threadMessage.timestamp) {
      return '';
    }

    const date = new Date(this.threadMessage.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  /**
   * Reagiert auf Hover-Ereignisse, wenn der Benutzer nicht derjenige ist, der die Nachricht gesendet hat.
   * @param isHovered Ein Wahrheitswert, der angibt, ob das Element gerade überfahren wird.
   */
  hovered(isHovered: boolean) {
    if (this.user?.id !== this.threadMessage.user?.id) {
      this.isHovered = isHovered;
    }
  }

  /**
   * Zeigt oder verbirgt die Reaktionsbox bei Hover-Ereignissen.
   * @param isHovered Ein Wahrheitswert, der angibt, ob das Element gerade überfahren wird.
   */
  showReactionBox(isHovered: boolean) {
    this.reactionBox = !this.reactionBox;
  }

  /**
   * Lädt die Nachrichten eines bestimmten Thread-Kanals.
   * @param threadChannelId Die ID des Thread-Kanals.
   * @returns Ein Observable mit den Nachrichten des Thread-Kanals.
   */
  loadThreadMessages(threadChannelId: number): Observable<Message[]> {
    return this.threadService.getThreadMessages(threadChannelId);
  }

  /**
   * Bestimmt die Zeit der letzten Nachricht im Thread.
   * Setzt die `lastMessageTime`-Variable im Format "HH:mm".
   */
  getLastMessageTime() {
    const lastMessage = this.threadMessages[this.threadMessages.length - 1];
    const date = new Date(lastMessage.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    this.lastMessageTime = `${hours}:${minutes}`;
  }

  /**
   * Gibt die vollständigen Informationen der aktuellen Thread-Nachricht aus (zu Debugging-Zwecken).
   */
  getInformation() {
    console.log(this.threadMessage);
  }

  /**
   * Passt die Größe eines Textbereichs automatisch an den Inhalt an.
   * @param event Das Ereignis, das den Resize auslöst.
   */
  autoResize(event: any) {
    const textArea = event.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  /**
   * Aktiviert den Bearbeitungsmodus für eine Nachricht und setzt deren Inhalt in das Eingabefeld.
   */
  editMessage() {
    this.messageContent = this.threadMessage.content;
    this.isEditingMessage = true;
  }

  /**
   * Speichert eine bearbeitete Nachricht im Thread und lädt den Thread erneut.
   */
  saveThreadMessage() {
    console.log('thread-message message:', this.threadMessage);
    let content: string = this.messageContent;
    this.threadService
      .updateThreadMessage(
        this.threadMessage.thread_channel,
        this.threadMessage.id,
        content
      )
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

  /**
   * Bricht den Bearbeitungsmodus einer Nachricht ab und stellt den ursprünglichen Inhalt wieder her.
   */
  cancelEditing() {
    this.messageContent = this.messageContent;
    this.isEditingMessage = false;
  }

  /**
   * Überprüft, ob eine gegebene Datei eine Bilddatei ist (basierend auf der Dateiendung).
   * @param fileUrl Der Dateipfad oder die URL der Datei.
   * @returns Wahrheitswert, der angibt, ob die Datei ein Bild ist.
   */
  isImage(fileUrl: string | null): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const fileExtension = fileUrl?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
  }

  /**
   * Gibt die URL eines Mediums (z. B. Bild, Video) zurück, basierend auf dem Dateipfad.
   * @param filePath Der Pfad zur Datei.
   * @returns Die vollständige URL zum Medium.
   */
  getMediaUrl(filePath: string | null): string {
    return `http://localhost:8000${filePath}`;
  }

  /**
   * Gibt den Dateinamen eines Mediums (z. B. Bild, Video) in einer benutzerfreundlicheren Form zurück.
   * @param filePath Der Pfad zur Datei.
   * @returns Der Dateiname, formatiert mit einem Großbuchstaben am Anfang.
   */
  getShortFileName(filePath: string | null): string {
    if (!filePath) return '';

    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];

    return fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase();
  }
}
