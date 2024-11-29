import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
export class ImpressumComponent {
  constructor(private router: Router){}

  backToLogin(){
    this.router.navigate(['/login']);
  }
}
