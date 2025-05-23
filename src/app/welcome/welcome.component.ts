import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  @Output() loginClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  openLogin() {
    this.router.navigate(['/login']);
  }
}
