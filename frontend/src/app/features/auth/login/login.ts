import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  form = {
    email: '',
    password: '',
    remember: true
  };

  erreur = '';
  chargement = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.chargement = true;
    this.erreur = '';

    this.auth.login(this.form).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token, res.user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.erreur = error?.error?.message || 'Email ou mot de passe incorrect';
        this.chargement = false;
      }
    });
  }
}