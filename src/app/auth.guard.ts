import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getCurrentUser } from '@aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (user) {
        return true;
      }
    } catch (e) {
      console.error('AuthGuard error:', e);
    }
    this.router.navigate(['/']);
    return false;
  }
}
