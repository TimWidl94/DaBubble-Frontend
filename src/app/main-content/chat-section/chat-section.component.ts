import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-chat-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-section.component.html',
  styleUrl: './chat-section.component.scss'
})
export class ChatSectionComponent {

  constructor(private channelService: ChannelService){}

  channel: Channel | null = null;

  ngOnInit(){
    this.channelService.loadSelectedChannel(3);


    this.channelService.selectedChannel$.subscribe((channel) => {
      this.channel = channel;
      console.log('geladener Channel in Chat-Section', this.channel)
    })
  }

}
