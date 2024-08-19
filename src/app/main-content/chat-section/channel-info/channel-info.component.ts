import { ChatSectionComponent } from './../chat-section.component';
import { Component, Input } from '@angular/core';
import { Channel } from '../../../models/channel.model';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [ChatSectionComponent],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.scss',
})
export class ChannelInfoComponent {
  constructor(
    private chatSection: ChatSectionComponent
  ) {
  }

  editName: boolean = false;
  editDescription: boolean = false;

  @Input() channel: Channel = {
    id: 0,
    channelName: '',
    channelDescription: '',
    channelMembers: [],
    messages: [],
    createdFrom: '',
  };

  closeEditOpen(){
    this.chatSection.openChannelEditMenu();
  }
}
