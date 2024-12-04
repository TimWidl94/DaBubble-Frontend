import { ThreadSectionComponent } from './../../../thread-section/thread-section.component';
import { MainContentComponent } from './../../../main-content.component';
import { UsersService } from './../../../../services/users.service';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';
import { MessageService } from '../../../../services/message.service';
import { ThreadService } from '../../../../services/thread.service';
import { MessageComponent } from '../message.component';
import { Message } from '../../../../models/message.model';

@Component({
  selector: 'app-reaction-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reaction-box.component.html',
  styleUrl: './reaction-box.component.scss',
})
export class ReactionBoxComponent {
  @Input() message!: Message;
  user: User | null = null;
  loggedInUser: boolean = false;
  editMessageBox: boolean = false;
  hoveredReactionEmoji: boolean = false;
  hoveredMessageEmoji: boolean = false;
  threadId: number = 0;

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private mainContentComponent: MainContentComponent,
    private threadService: ThreadService,
    private messageComponent: MessageComponent
  ) {}

  ngOnInit() {
    this.checkIfMessageUser();
  }

  /**
   * Checks if the currently logged-in user is the sender of the message.
   * Updates the `loggedInUser` property accordingly.
   */
  checkIfMessageUser() {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
    });
    if (this.user!.id == this.message.sender) {
      this.loggedInUser = !this.loggedInUser;
    }
  }

  /**
   * Updates the hover state for the edit message box.
   * @param hovered Indicates whether the edit message box is hovered.
   */
  isHoveredEditMessageBox(hovered: boolean) {
    this.editMessageBox = hovered;
  }

  /**
   * Updates the hover state for the reaction emoji element.
   * @param hovered Indicates whether the reaction emoji is hovered.
   */
  isHoveredReactionEmoji(hovered: boolean) {
    this.hoveredReactionEmoji = hovered;
  }

  /**
   * Updates the hover state for the message emoji element.
   * @param hovered Indicates whether the message emoji is hovered.
   */
  isHoveredMessageEmoji(hovered: boolean) {
    this.hoveredMessageEmoji = hovered;
  }

  /**
   * Opens a thread for the specified message.
   * Retrieves the thread or creates a new one using the thread service.
   */
  openThread() {
    let channelId = this.message.channel;
    let messageId = this.message.id;
    this.threadService.openThread(channelId, messageId).subscribe(
      (response) => {
        if (response.id) {
          this.threadService.threadSubject.next(response);
          this.mainContentComponent.threadOpen = true;
        }
        console.log('Thread created/loaded reactionBox:', response);
      },
      (error) => {
        console.error('Error creating thread:', error);
      }
    );
  }

  /**
   * Initiates the edit process for the current message by calling the editMessage method.
   */
  editingMessage() {
    this.messageComponent.editMessage();
  }

  /**
   * Toggles the specified emoji reaction for the current message.
   * If the emoji is already present, it is removed; otherwise, it is added.
   * Updates the message's emoji reactions on the server.
   * @param emojiType The type of emoji to toggle (e.g., "like", "heart").
   */
  sendEmoji(emojiType: string) {
    let emoji = emojiType;
    let messageEmoji = `emoji_${emoji}`;
    let index = this.message[messageEmoji].indexOf(this.user);
    if (index > -1) {
      this.message[messageEmoji].splice(index, 1);
    } else {
      this.message[messageEmoji].push(this.user);
    }
    console.log(this.message);
    this.messageService
      .updateMessageEmojis(this.message.channel, this.message.id, this.message)
      .subscribe(
        (response) => {
          console.log('Emoji updated:', response);
        },
        (error) => {
          console.error('Error updating emoji:', error);
        }
      );
  }
}
