import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class AuthAdminGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.payload;
    const groups = idToken && idToken['cognito:groups'];
    if (Array.isArray(groups) && groups.includes('admin')) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
