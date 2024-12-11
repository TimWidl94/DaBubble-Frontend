import { MessageService } from './../../../services/message.service';
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
import { ChatSectionComponent } from '../chat-section.component';
import { EmojiReactionComponent } from '../../../shared/emoji/emoji-reaction/emoji-reaction.component';
import { MediaChangeViewService } from '../../../services/media-change-view.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CommonModule,
    ReactionBoxComponent,
    FormsModule,
    EmojiReactionComponent,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor(
    private usersService: UsersService,
    private threadService: ThreadService,
    private mainContentComponent: MainContentComponent,
    private messageService: MessageService,
    private mediaChangeService: MediaChangeViewService
  ) {}

  isHovered: boolean = false;
  isEditingMessage: boolean = false;
  messageContent!: string;

  [key: string]: any;

  userId?: number;
  user: User | null = null;
  threadMessages: Message[] = [];
  lastMessageTime?: string;

  @Input() message!: Message;

  reactionBox: boolean = false;

  /**
   * Initializes the component by loading the user from the token and subscribing to user data.
   * If the message has a thread channel, it loads the thread messages.
   */
  ngOnInit() {
    this.usersService.loadUserFromToken();
    this.usersService.user$.subscribe((user) => {
      this.user = user;
      this.userId = this.user?.id;
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
  }

  /**
   * Converts a timestamp into a formatted string with hours and minutes (HH:mm).
   * @returns A string representing the time in "HH:mm" format or an empty string if no timestamp is available.
   */
  getTimeFromTimestamp(): string {
    if (!this.message.timestamp) {
      return '';
    }

    const date = new Date(this.message.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  /**
   * Sets the hover state for the message element if the logged-in user is not the sender.
   * @param isHovered Indicates whether the message element is hovered.
   */
  hovered(isHovered: boolean) {
    if (this.user?.id !== this.message.user?.id) {
      this.isHovered = isHovered;
    }
  }

  /**
   * Toggles the visibility of the reaction box when the message is hovered.
   * @param isHovered Indicates whether the message element is hovered.
   */
  showReactionBox(isHovered: boolean) {
    this.reactionBox = !this.reactionBox;
  }

  /**
   * Opens a thread for the current message by making an API request.
   * The thread is opened, and the screen is adjusted for mobile view if necessary.
   */
  openThread() {
    this.threadService
      .openThread(this.message.channel, this.message.id)
      .subscribe(
        (response) => {
          if (response.id) {
            this.threadService.threadSubject.next(response);
            this.mainContentComponent.threadOpen = true;
            this.mediaChangeService.setThreadScreenMobile(true);
          }
        },
        (error) => {
          console.error('Error creating thread:', error);
        }
      );
  }

  /**
   * Loads the messages for a given thread channel.
   * @param threadChannelId The ID of the thread channel to load messages from.
   * @returns An observable containing the list of thread messages.
   */
  loadThreadMessages(threadChannelId: number): Observable<Message[]> {
    return this.threadService.getThreadMessages(threadChannelId);
  }

  /**
   * Sets the last message's time (in HH:mm format) for the current thread.
   */
  getLastMessageTime() {
    const lastMessage = this.threadMessages[this.threadMessages.length - 1];
    const date = new Date(lastMessage.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    this.lastMessageTime = `${hours}:${minutes}`;
  }

  /**
   * Auto-resizes a text area based on its content to ensure it grows dynamically with user input.
   * @param event The input event that triggered the resizing.
   */
  autoResize(event: any) {
    const textArea = event.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  /**
   * Prepares the message content for editing and sets the editing state to true.
   */
  editMessage() {
    this.messageContent = this.message.content;
    this.isEditingMessage = true;
  }

  /**
   * Saves the updated message content and updates the message in the backend.
   * @param content The new content for the message.
   */
  saveMessage() {
    let content: string = this.messageContent;
    let emojiData = this.message;
    this.messageService
      .updateMessage(this.message.channel, this.message.id, content, emojiData)
      .subscribe(
        (response) => {
          this.isEditingMessage = false;
          this.messageService.getMessages(this.message.channel);
        },
        (error) => {
          console.error('Error updating message:', error);
        }
      );
  }

  /**
   * Cancels the editing process without saving changes.
   */
  cancelEditing() {
    this.messageContent = this.messageContent;
    this.isEditingMessage = false;
  }

  /**
   * Checks if a given file URL is an image based on its extension.
   * @param fileUrl The URL of the file.
   * @returns A boolean indicating whether the file is an image.
   */
  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
  }

  /**
   * Constructs a full URL for a media file given its path.
   * @param filePath The relative file path.
   * @returns The full URL for the media file.
   */
  getMediaUrl(filePath: string): string {
    return `http://localhost:8000${filePath}`;
  }

  /**
   * Extracts and returns the short file name from a file path.
   * The file name is capitalized.
   * @param filePath The path to the file.
   * @returns The capitalized file name.
   */
  getShortFileName(filePath: string): string {
    if (!filePath) return '';

    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];

    return fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase();
  }
}
