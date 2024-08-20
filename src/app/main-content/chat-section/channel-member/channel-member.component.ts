import { Component, Input } from '@angular/core';
import { Channel } from '../../../models/channel.model';
import { User } from '../../../models/user.model';
import { ChatSectionComponent } from '../chat-section.component';
import { CommonModule } from '@angular/common';
import { NewChannelMemberComponent } from '../new-channel-member/new-channel-member.component';

@Component({
  selector: 'app-channel-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-member.component.html',
  styleUrl: './channel-member.component.scss'
})
export class ChannelMemberComponent {

  newMemberBtnHovered:boolean = false;

    constructor(
      private chatSection: ChatSectionComponent,
    ){

    }

  @Input() channel: Channel = {
    id: 0,
    channelName: '',
    channelDescription: '',
    channelMembers: [],
    messages: [],
    createdFrom: '',
  };

  @Input() allUser: any[] = [];


  ngOnInit(){
    console.log(this.channel);
    console.log(this.allUser);
  }

  closeChannelMember(){
    this.chatSection.channelMemberOpen = false;
  }

  addNewChannelMember(){
    this.chatSection.channelMemberOpen = false;
    this.chatSection.addNewChannelMemberOpen = true;
  }

  onHover(isHovered: boolean) {
    this.newMemberBtnHovered = isHovered;
  }
}
