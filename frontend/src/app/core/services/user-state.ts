import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  user = signal<any>(null);
  isLoggedIn = signal(false);

  constructor(private auth: AuthService) {
    this.refresh();
  }

  refresh() {
    this.isLoggedIn.set(this.auth.isLoggedIn());
    this.user.set(this.auth.getUser());
  }

  logout() {
    this.auth.logout();
    this.user.set(null);
    this.isLoggedIn.set(false);
  }
}