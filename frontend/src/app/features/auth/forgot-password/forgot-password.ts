import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  erreur = '';
  chargement = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.chargement = true;
    this.message = '';
    this.erreur = '';

    this.http.post<any>('http://127.0.0.1:8000/api/forgot-password', { email: this.email })
      .subscribe({
        next: (res) => {
          this.message = res.message;
          this.chargement = false;
        },
        error: (err) => {
          this.erreur = err.error?.message || 'Email introuvable.';
          this.chargement = false;
        }
      });
  }
}