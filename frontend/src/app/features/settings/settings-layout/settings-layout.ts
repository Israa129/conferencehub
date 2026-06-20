import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './settings-layout.html',
  styleUrl: './settings-layout.scss'
})
export class SettingsLayout {
  menu = [
    { label: 'Mon profil',              icon: '👤', route: '/profile',                 exact: false },
    { label: 'Sécurité du compte',      icon: '🔒', route: '/settings/security',       exact: true  },
    { label: 'Notifications',           icon: '🔔', route: '/settings/notifications',  exact: true  },
    { label: "Préférences d'affichage", icon: '🎨', route: '/settings/display',        exact: true  },
    { label: 'Confidentialité',         icon: '🛡️', route: '/settings/privacy',        exact: true  },
  ];
}