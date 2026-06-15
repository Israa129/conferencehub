import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './features/navbar/navbar';
import { Sidebar } from './features/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Navbar, Sidebar],
  templateUrl: './app.html',
})
export class App {
  showLayout = true;
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
    const noLayout = ['/login', '/register', '/forgot-password', '/reset-password'];
    const currentUrl = event.url;

    this.showLayout = !noLayout.includes(currentUrl) && currentUrl !== '/';
    this.showNavbar = this.showLayout;
          }
    });
  }
}