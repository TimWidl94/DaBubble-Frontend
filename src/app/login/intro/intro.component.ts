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

  ngOnInit(): void {
    this.introPlayed = true;
    if (this.introPlayed) {
      setTimeout(() => {
        this.router.navigate(['/login']); // Pfad zur Login-Seite
      }, 5500); // 5000 Millisekunden = 5 Sekunden
    }
  }
}
