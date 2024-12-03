import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-protection',
  standalone: true,
  imports: [],
  templateUrl: './data-protection.component.html',
  styleUrl: './data-protection.component.scss'
})
export class DataProtectionComponent {
  constructor(private router: Router){}

  backToLogin(){
    this.router.navigate(['/login']);
  }

}
