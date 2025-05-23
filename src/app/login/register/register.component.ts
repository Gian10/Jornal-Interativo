import { Component, Output, EventEmitter } from '@angular/core';
import { signUp, confirmSignUp } from '@aws-amplify/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;
  success = false;
  showVerification = false;
  verificationCode = '';

  @Output() close = new EventEmitter<void>();

  async register() {
    this.loading = true;
    this.error = null;
    try {
      await signUp({
        username: this.username,
        password: this.password,
        options: { userAttributes: { email: this.username } }
      });
      this.showVerification = true;
    } catch (err: any) {
      this.error = err.message || 'Erro ao criar conta';
    } finally {
      this.loading = false;
    }
  }

  async verifyCode() {
    this.loading = true;
    this.error = null;
    try {
      await confirmSignUp({ username: this.username, confirmationCode: this.verificationCode });
      this.success = true;
      this.showVerification = false;
    } catch (err: any) {
      this.error = err.message || 'Erro ao verificar código';
    } finally {
      this.loading = false;
    }
  }

  closeRegister() {
    this.close.emit();
  }
}
