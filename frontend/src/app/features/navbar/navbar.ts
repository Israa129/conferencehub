import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  user: any = null;
  isAuthPage = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.user = this.auth.getUser();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
        this.isAuthPage = authPages.some(p => event.url.startsWith(p));
        this.isLoggedIn = this.auth.isLoggedIn();
        this.user = this.auth.getUser();
      }
    });
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.user = null;
  }
}