import { ChatSectionComponent } from './../chat-section.component';
import { Component, Input } from '@angular/core';
import { Channel } from '../../../models/channel.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';

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
    private channelService: ChannelService
  ) {
  }

  editName: boolean = false;
  editDescription: boolean = false;
  isEditing = false;

  channelName: string = '';
  channelDescription: string = '';

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

  toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false;
      this.saveEdit();
    } else {
      this.isEditing = true;
    }
  }


  saveEdit(){
    const updatedChannelName = {
      ... this.channel,
      channelName: this.channelName,
    }
    let channelId = this.channel.id;
    console.log(updatedChannelName)
    this.channelService.updateChannel(updatedChannelName, channelId).subscribe(
      (response) => {
        console.log(response)
        this.chatSection.updateChannel(this.channel.id);
      }
    )
  }
}
