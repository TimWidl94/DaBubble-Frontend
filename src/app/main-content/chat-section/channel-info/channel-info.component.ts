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
    private cdRef: ChangeDetectorRef,
  ) {}



  editName: boolean = false;
  editDescription: boolean = false;
  isEditingName = false;
  isEditingDescription = false;
  fullsizeShadowOn:boolean = false;

  channelName: string = '';
  channelDescription: string = '';

  @Input() channel!: Channel;

  @Input() user!: User;

  @Input() allUser: User[] = [];

  ngOnInit() {
    this.loadFullsizeShadowMobile();
  }

  loadFullsizeShadowMobile(){
    this.mediaChangeViewService.fullsizeShadow$.subscribe((shadow) => {
      this.fullsizeShadowOn = shadow;
      this.cdRef.detectChanges();
    })
  }

  closeEditOpen() {
    this.chatSection.openChannelEditMenu();
    this.mediaChangeViewService.setFullSizeShadowMobile(false);
  }

  toggleEditName() {
    if (this.isEditingName) {
      this.isEditingName = false;
      this.saveEditChannelName();
    } else {
      this.isEditingName = true;
    }
  }

  saveEditChannelName() {
    const updatedChannelName = {
      ...this.channel,
      channelName: this.channelName,
    };
    let channelId = this.channel.id;
    console.log(updatedChannelName);
    this.channelService
      .updateChannel(updatedChannelName, channelId)
      .subscribe((response) => {
        console.log(response);
        this.chatSection.updateChannel(this.channel.id);
      });
  }

  toggleEditDescription() {
    if (this.isEditingDescription) {
      this.isEditingDescription = false;
      this.saveEditChannelDescription();
    } else {
      this.isEditingDescription = true;
      console.log(this.channel.channelDescription);
    }
  }

  saveEditChannelDescription() {
    const updateChannelDescription = {
      ...this.channel,
      channelDescription: this.channelDescription,
    };
    let channelId = this.channel.id;
    this.channelService
      .updateChannel(updateChannelDescription, channelId)
      .subscribe((respone) => {
        console.log(respone);
        this.chatSection.updateChannel(this.channel.id);
      });
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Höhe zurücksetzen
    textarea.style.height = 72 + 'px'; // Höhe anpassen
  }

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

  saveLeaveChannel() {
    let updateChannelMember = {
      ...this.channel,
      channelMembers: this.leaveChannel(),
    };
    let channelId = this.channel.id;
    this.channelService
      .updateChannel(updateChannelMember, channelId)
      .subscribe((respone) => {
        this.chatSection.updateChannel(this.channel.id);
        this.closeEditOpen();
      });
  }

  openProfilInfo(user: User) {
    this.chatSection.openProfilInformation(user);
  }

  addNewChannelMember() {
    this.chatSection.channelMemberOpen = false;
    this.chatSection.addNewChannelMemberOpen = true;
    this.mediaChangeViewService.setFullSizeShadowMobile(true);
  }
}
