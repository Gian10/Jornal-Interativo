import { Component, Output, EventEmitter } from '@angular/core';
import { signIn, confirmSignIn } from '@aws-amplify/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  newPassword = '';
  error: string | null = null;
  loading = false;
  requireNewPassword = false;
  cognitoUser: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  constructor(private router: Router) {}

  async login() {
    this.loading = true;
    this.error = null;
    try {
      const user = await signIn({ username: this.username, password: this.password });
      if (user.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        this.requireNewPassword = true;
        this.cognitoUser = user;
        this.loading = false;
        return;
      }
      localStorage.setItem('cognitoUser', JSON.stringify(user));
      this.loginSuccess.emit();
      this.close.emit();
      this.router.navigate(['/news']);
    } catch (err: any) {
      this.error = err.message || 'Erro ao fazer login';
    } finally {
      this.loading = false;
    }
  }

  async submitNewPassword() {
    this.loading = true;
    this.error = null;
    try {
      const result = await confirmSignIn({ challengeResponse: this.newPassword });
      if (result.isSignedIn) {
        localStorage.setItem('cognitoUser', JSON.stringify(result));
        this.loginSuccess.emit();
        this.close.emit();
        this.router.navigate(['/news']);
      } else {
        this.error = 'Não foi possível completar o login.';
      }
    } catch (err: any) {
      this.error = err.message || 'Erro ao definir nova senha';
    } finally {
      this.loading = false;
    }
  }

  closeLogin() {
    this.close.emit();
    this.router.navigate(['/']);
  }
}
