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

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
    const noLayout = ['/login', '/register', '/forgot-password', '/reset-password'];
    this.showLayout = !noLayout.includes(event.url) && event.url !== '/';
      }
    });
  }
}