import { Component } from '@angular/core';

@Component({
  selector: 'app-devspace-section',
  standalone: true,
  imports: [],
  templateUrl: './devspace-section.component.html',
  styleUrl: './devspace-section.component.scss'
})
export class DevspaceSectionComponent {
  isHoveredChannel:boolean = false;
  isHoveredDirectMessage:boolean = false;

  onHoverChannel(isHovered: boolean) {
    this.isHoveredChannel = isHovered;
  }

  onHoverDm(isHovered: boolean){
    this.isHoveredDirectMessage = isHovered;
  }
}
