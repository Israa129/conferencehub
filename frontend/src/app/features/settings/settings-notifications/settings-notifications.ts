import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings';

@Component({
  selector: 'app-settings-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-notifications.html',
})
export class SettingsNotifications implements OnInit {
  form = {
    notif_email_inscription: true,
    notif_email_conference:  true,
    notif_email_newsletter:  false,
    notif_push:              true,
  };
  loading = false;
  success = '';
  error = '';

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    this.settings.getSettings().subscribe({
      next: (data: any) => this.form = { ...data.notifications }
    });
  }

  save() {
    this.loading = true;
    this.settings.updateNotifications(this.form).subscribe({
      next: (res: any) => {
        this.success = res.message;
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Erreur lors de la sauvegarde.'; this.loading = false; }
    });
  }
}