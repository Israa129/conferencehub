import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPasswordComponent implements OnInit {
  form = {
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
  };
  message = '';
  erreur = '';
  chargement = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form.token = this.route.snapshot.queryParams['token'] || '';
    this.form.email = this.route.snapshot.queryParams['email'] || '';
  }

  onSubmit() {
    this.chargement = true;
    this.erreur = '';

    this.http.post<any>('http://127.0.0.1:8000/api/reset-password', this.form)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.erreur = err.error?.message || 'Erreur lors de la réinitialisation.';
          this.chargement = false;
        }
      });
  }
}