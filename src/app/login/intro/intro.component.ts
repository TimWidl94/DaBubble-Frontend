import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
})
export class IntroComponent {
  constructor(private router: Router) {}

  introPlayed: boolean = false;

  /**
   * Initializes the component by setting the intro state and navigating to the login page after a delay.
   * Plays an introductory sequence before redirecting.
   */
  ngOnInit(): void {
    this.introPlayed = true;
    if (this.introPlayed) {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 5500);
    }
  }
}
