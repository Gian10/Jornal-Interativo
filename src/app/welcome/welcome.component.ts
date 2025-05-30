import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getCurrentUser } from '@aws-amplify/auth';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  @Output() loginClick = new EventEmitter<void>();

  constructor(private router: Router) {
    this.checkIfLoggedIn();
  }

  async checkIfLoggedIn() {
    try {
      const user = await getCurrentUser();
      if (user) {
        this.router.navigate(['/news']);
      }
    } catch (e) {
      // Usuário não logado, permanece na tela inicial
    }
  }

  openLogin() {
    this.router.navigate(['/login']);
  }
}
