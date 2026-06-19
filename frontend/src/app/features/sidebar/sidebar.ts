import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { UserStateService } from '../../core/services/user-state';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  showSidebar = false;

  constructor(
    public userState: UserStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkSidebar(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkSidebar(event.url);
        this.userState.refresh();
      }
    });
  }

  checkSidebar(url: string) {
    const noSidebarPages = ['/', '/login', '/register', '/forgot-password',
                            '/reset-password', '/conferences', '/appels',
                            '/institutions', '/contact'];
    this.showSidebar = this.userState.isLoggedIn() &&
                       !noSidebarPages.includes(url) &&
                       !url.startsWith('/conferences/');
  }

  logout() {
    this.userState.logout();
    this.router.navigate(['/']);
  }
}