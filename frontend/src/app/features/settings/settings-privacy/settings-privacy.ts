import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings';

@Component({
  selector: 'app-settings-privacy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-privacy.html',
})
export class SettingsPrivacy implements OnInit {
  form = { visibilite_profil: 'membres', afficher_email: false, afficher_pays: true };
  loading = false;
  success = '';
  error = '';

  visibilites = [
    { value: 'public',  label: '🌍 Public',  desc: 'Visible par tous les visiteurs' },
    { value: 'membres', label: '👥 Membres', desc: 'Visible uniquement par les membres connectés' },
    { value: 'prive',   label: '🔒 Privé',   desc: 'Visible uniquement par vous' },
  ];

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    this.settings.getSettings().subscribe({
      next: (data: any) => this.form = { ...data.privacy }
    });
  }

  save() {
    this.loading = true;
    this.settings.updatePrivacy(this.form).subscribe({
      next: (res: any) => {
        this.success = res.message;
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Erreur lors de la sauvegarde.'; this.loading = false; }
    });
  }
}