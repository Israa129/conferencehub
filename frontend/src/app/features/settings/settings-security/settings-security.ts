import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../../core/services/settings';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-settings-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-security.html',
})
export class SettingsSecurity {
  deletePassword = '';
  loadingDelete = false;
  error = '';
  showDeleteConfirm = false;

  constructor(
    private settings: SettingsService,
    private auth: AuthService,
    private router: Router
  ) {}

  confirmDelete() {
    this.loadingDelete = true;
    this.error = '';
    this.settings.deleteAccount(this.deletePassword).subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.error = err.error?.errors?.password?.[0] || 'Mot de passe incorrect.';
        this.loadingDelete = false;
      }
    });
  }
}