import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  form = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    pays: ''
  };
  erreur = '';
  chargement = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.chargement = true;
    this.erreur = '';
    this.auth.register(this.form).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: { registered: 'success' }
        });
      },
      error: (err) => {
        this.erreur = err.error?.message || 'Erreur lors de l\'inscription';
        this.chargement = false;
      }
    });
  }
}