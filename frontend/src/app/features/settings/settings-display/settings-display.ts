import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings';

@Component({
  selector: 'app-settings-display',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-display.html',
})
export class SettingsDisplay implements OnInit {
  form = { theme: 'system', langue: 'fr', densite: 'confort' };
  loading = false;
  success = '';
  error = '';

  themes   = [
    { value: 'light',  label: '☀️ Clair'   },
    { value: 'dark',   label: '🌙 Sombre'  },
    { value: 'system', label: '💻 Système' },
  ];
  langues  = [
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'en', label: '🇬🇧 English'  },
    { value: 'es', label: '🇪🇸 Español'  },
  ];
  densites = [
    { value: 'compact',  label: 'Compact'   },
    { value: 'confort',  label: 'Confort'   },
    { value: 'spacieux', label: 'Spacieux'  },
  ];

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    this.settings.getSettings().subscribe({
      next: (data: any) => this.form = { ...data.display }
    });
  }

  save() {
    this.loading = true;
    this.settings.updateDisplay(this.form).subscribe({
      next: (res: any) => {
        this.success = res.message;
        this.loading = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: () => { this.error = 'Erreur lors de la sauvegarde.'; this.loading = false; }
    });
  }
}