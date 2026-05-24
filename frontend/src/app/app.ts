import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit {
  apiStatus = signal('Chargement...');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://127.0.0.1:8000/api/test').subscribe({
      next: (res) => this.apiStatus.set(res.message),
      error: () => this.apiStatus.set('Erreur de connexion')
    });
  }
}