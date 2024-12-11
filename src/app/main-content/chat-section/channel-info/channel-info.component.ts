import { ChatSectionComponent } from './../chat-section.component';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Channel } from '../../../models/channel.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { User } from '../../../models/user.model';
import { MediaChangeViewService } from '../../../services/media-change-view.service';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.scss',
})
export class ChannelInfoComponent {
  constructor(
    private chatSection: ChatSectionComponent,
    private channelService: ChannelService,
    private mediaChangeViewService: MediaChangeViewService,
    private cdRef: ChangeDetectorRef
  ) {}

  editName: boolean = false;
  editDescription: boolean = false;
  isEditingName = false;
  isEditingDescription = false;
  fullsizeShadowOn: boolean = false;

  channelName: string = '';
  channelDescription: string = '';

  @Input() channel!: Channel;

  @Input() user!: User;

  @Input() allUser: User[] = [];

  ngOnInit() {
    this.loadFullsizeShadowMobile();
  }

  /**
   * Subscribes to changes in the full-size shadow state for mobile views.
   * Updates the local `fullsizeShadowOn` property and triggers change detection.
   */
  loadFullsizeShadowMobile() {
    this.mediaChangeViewService.fullsizeShadow$.subscribe((shadow) => {
      this.fullsizeShadowOn = shadow;
      this.cdRef.detectChanges();
    });
  }

  /**
   * Closes the edit menu for the chat section and disables the full-size shadow for mobile views.
   */
  closeEditOpen() {
    this.chatSection.openChannelEditMenu();
    this.mediaChangeViewService.setFullSizeShadowMobile(false);
  }

  /**
   * Toggles the editing state of the channel name.
   * Saves the updated channel name if editing is toggled off.
   */
  toggleEditName() {
    if (this.isEditingName) {
      this.isEditingName = false;
      this.saveEditChannelName();
    } else {
      this.isEditingName = true;
    }
  }

  /**
   * Saves the updated channel name to the server and refreshes the channel view.
   */
  saveEditChannelName() {
    const updatedChannelName = {
      ...this.channel,
      channelName: this.channelName,
    };
    let channelId = this.channel.id;
    this.channelService
      .updateChannel(updatedChannelName, channelId)
      .subscribe((response) => {
        this.chatSection.updateChannel(this.channel.id);
      });
  }

  /**
   * Toggles the editing state of the channel description.
   * Saves the updated channel description if editing is toggled off.
   */
  toggleEditDescription() {
    if (this.isEditingDescription) {
      this.isEditingDescription = false;
      this.saveEditChannelDescription();
    } else {
      this.isEditingDescription = true;
    }
  }

  /**
   * Saves the updated channel description to the server and refreshes the channel view.
   */
  saveEditChannelDescription() {
    const updateChannelDescription = {
      ...this.channel,
      channelDescription: this.channelDescription,
    };
    let channelId = this.channel.id;
    this.channelService
      .updateChannel(updateChannelDescription, channelId)
      .subscribe((response) => {
        this.chatSection.updateChannel(this.channel.id);
      });
  }

  /**
   * Automatically resizes a textarea element to fit its content.
   * @param event The input event triggered by the textarea.
   */
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = 72 + 'px'; // Adjust height
  }

  /**
   * Removes the current user from the channel members list.
   * @returns The updated list of channel members.
   */
  leaveChannel() {
    let i = this.channel.channelMembers.findIndex(
      (member) => member === this.user.id
    );
    if (i !== -1) {
      this.channel.channelMembers.splice(i, 1);
      return this.channel.channelMembers;
    } else {
      return this.channel.channelMembers;
    }
  }

  /**
   * Saves the updated channel members list after a user leaves the channel.
   * Refreshes the channel view and closes the edit menu.
   */
  saveLeaveChannel() {
    let updateChannelMember = {
      ...this.channel,
      channelMembers: this.leaveChannel(),
    };
    let channelId = this.channel.id;
    this.channelService
      .updateChannel(updateChannelMember, channelId)
      .subscribe((response) => {
        this.chatSection.updateChannel(this.channel.id);
        this.closeEditOpen();
      });
  }

  /**
   * Opens the profile information view for the specified user.
   * @param user The user whose profile information should be displayed.
   */
  openProfilInfo(user: User) {
    this.chatSection.openProfilInformation(user);
  }

  /**
   * Opens the interface to add a new channel member.
   * Adjusts the full-size shadow state for mobile views accordingly.
   */
  addNewChannelMember() {
    this.chatSection.channelMemberOpen = false;
    this.chatSection.addNewChannelMemberOpen = true;
    this.mediaChangeViewService.setFullSizeShadowMobile(true);
  }
}
