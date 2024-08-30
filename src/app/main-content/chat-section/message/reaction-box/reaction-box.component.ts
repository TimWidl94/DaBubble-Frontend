import { ThreadSectionComponent } from './../../../thread-section/thread-section.component';
import { MainContentComponent } from './../../../main-content.component';
import { UsersService } from './../../../../services/users.service';
import { Component, Input } from '@angular/core';
import { Message } from '../../../../models/message.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';
import { MessageService } from '../../../../services/message.service';
import { ThreadService } from '../../../../services/thread.service';
import { MessageComponent } from '../message.component';

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
    private messageComponent: MessageComponent,
  ) {}

  ngOnInit() {
    // console.log(this.message);
    this.checkIfMessageUser();
  }

  checkIfMessageUser() {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
    });
    if (this.user!.id == this.message.sender) {
      this.loggedInUser = !this.loggedInUser;
    }
  }

  isHoveredEditMessageBox(hovered: boolean) {
    this.editMessageBox = hovered;
  }

  isHoveredReactionEmoji(hovered: boolean) {
    this.hoveredReactionEmoji = hovered;
  }

  isHoveredMessageEmoji(hovered: boolean) {
    this.hoveredMessageEmoji = hovered;
  }

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

  editingMessage(){
    this.messageComponent.editMessage();
  }
}
