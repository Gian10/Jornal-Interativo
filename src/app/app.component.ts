import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { signOut, getCurrentUser } from '@aws-amplify/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jornal-interativo';
  user: any = null;
  showLoginModal = false;
  showLogin = false;
  anoAtual = new Date().getFullYear();
  
  constructor(private router: Router) {}

  async logout() {
    await signOut();
    this.user = null;
    localStorage.removeItem('cognitoUser');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('cognitoUser');
  }
}
