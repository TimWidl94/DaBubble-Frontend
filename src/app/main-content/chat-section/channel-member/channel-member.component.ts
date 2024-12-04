import { Component, Input } from '@angular/core';
import { Channel } from '../../../models/channel.model';
import { User } from '../../../models/user.model';
import { ChatSectionComponent } from '../chat-section.component';
import { CommonModule } from '@angular/common';
import { NewChannelMemberComponent } from '../new-channel-member/new-channel-member.component';
import { ProfilInfoComponent } from '../profil-info/profil-info.component';

@Component({
  selector: 'app-channel-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-member.component.html',
  styleUrl: './channel-member.component.scss',
})
export class ChannelMemberComponent {
  newMemberBtnHovered: boolean = false;
  profilInformationOpen: boolean = false;

  constructor(private chatSection: ChatSectionComponent) {}

  @Input() channel!: Channel;

  @Input() allUser: User[] = [];

  ngOnInit() {}

  /**
   * Closes the channel member view by setting the corresponding state to false.
   */
  closeChannelMember() {
    this.chatSection.channelMemberOpen = false;
  }

  /**
   * Opens the interface for adding a new channel member.
   * Closes the existing channel member view in the process.
   */
  addNewChannelMember() {
    this.chatSection.channelMemberOpen = false;
    this.chatSection.addNewChannelMemberOpen = true;
  }

  /**
   * Toggles the hover state for the "Add New Member" button.
   * @param isHovered Indicates whether the button is currently hovered.
   */
  onHover(isHovered: boolean) {
    this.newMemberBtnHovered = isHovered;
  }

  /**
   * Opens the profile information view for the specified user.
   * @param user The user whose profile information should be displayed.
   */
  openProfilInfo(user: User) {
    this.chatSection.openProfilInformation(user);
  }
}
