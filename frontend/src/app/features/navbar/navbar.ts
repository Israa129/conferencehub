import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { UserStateService } from '../../core/services/user-state';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isAuthPage = false;

  constructor(
    public userState: UserStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkPage(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkPage(event.url);
        this.userState.refresh();
      }
    });
  }

  checkPage(url: string) {
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    this.isAuthPage = authPages.some(p => url.startsWith(p));
  }

  logout() {
    this.userState.logout();
    this.router.navigate(['/']);
  }
}