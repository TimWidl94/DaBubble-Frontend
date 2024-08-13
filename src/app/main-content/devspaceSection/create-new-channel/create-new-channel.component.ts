import { ChannelService } from '../../../services/channel.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-new-channel',
  standalone: true,
  imports: [],
  templateUrl: './create-new-channel.component.html',
  styleUrl: './create-new-channel.component.scss'
})
export class CreateNewChannelComponent {

  constructor(private channelService: ChannelService){}

  closeCreateChannelBox(){
    this.channelService.setcreateChannelScreen(false)
  }

}
