import { Component } from '@angular/core';
import { HeaderMainContentComponent } from './header-main-content/header-main-content.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [HeaderMainContentComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
