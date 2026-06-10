import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  form = {
    email: '',
    password: '',
    remember: true
  };
  erreur = '';
  succes = '';
  chargement = false;
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // ✅ Message si on vient de s'inscrire
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') {
        this.succes = '✅ Compte créé avec succès ! Connectez-vous.';
      }
    });
  }

  onSubmit() {
    this.chargement = true;
    this.erreur = '';
    this.auth.login(this.form).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token, res.user);
        // ✅ Redirection selon le rôle
        const role = res.user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'organisateur') {
          this.router.navigate(['/organisateur']);
        } else if (role === 'conferencier') {
          this.router.navigate(['/conferencier/dashboard']);
        } else {
          this.router.navigate(['/participant/dashboard']);
        }
      },
      error: (error) => {
        this.erreur = error?.error?.message || 'Email ou mot de passe incorrect';
        this.chargement = false;
      }
    });
  }
}