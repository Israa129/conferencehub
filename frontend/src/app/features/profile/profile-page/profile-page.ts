import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile';
import { AuthService }    from '../../../core/services/auth';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss'
})
export class ProfilePageComponent implements OnInit {

  onglet: 'profil' | 'securite' = 'profil';

  form = {
    nom: '',
    prenom: '',
    email: '',
    pays: '',
    role: ''
  };

  passwordForm = {
    current_password: '',
    password: '',
    password_confirmation: ''
  };

  chargement = true;
  sauvegarde = false;
  messageSucces = '';
  messageErreur = '';
  messageSuccesMdp = '';
  messageErreurMdp = '';

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef   // ✅ AJOUT
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.chargement = true;
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.form = {
          nom:    user.nom    || '',
          prenom: user.prenom || '',
          email:  user.email  || '',
          pays:   user.pays   || '',
          role:   user.role   || ''
        };
        this.chargement = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      }
    });
  }

  saveProfile() {
    this.sauvegarde = true;
    this.messageSucces = '';
    this.messageErreur = '';

    this.profileService.updateProfile({
      nom:    this.form.nom,
      prenom: this.form.prenom,
      email:  this.form.email,
      pays:   this.form.pays
    }).subscribe({
      next: (res) => {
        this.messageSucces = res.message;
        const user = this.auth.getUser();
        this.auth.saveToken(this.auth.getToken()!, {
          ...user,
          nom:    this.form.nom,
          prenom: this.form.prenom,
          email:  this.form.email,
          pays:   this.form.pays
        });
        this.sauvegarde = false;
        this.cdr.detectChanges();   // ✅ AJOUT
        setTimeout(() => {
          this.messageSucces = '';
          this.cdr.detectChanges();   // ✅ AJOUT
        }, 3000);
      },
      error: (err) => {
        this.messageErreur = err.error?.message || 'Erreur lors de la mise à jour.';
        this.sauvegarde = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      }
    });
  }

  savePassword() {
    this.sauvegarde = true;
    this.messageSuccesMdp = '';
    this.messageErreurMdp = '';

    this.profileService.updatePassword(this.passwordForm).subscribe({
      next: (res) => {
        this.messageSuccesMdp = res.message;
        this.passwordForm = {
          current_password: '',
          password: '',
          password_confirmation: ''
        };
        this.sauvegarde = false;
        this.cdr.detectChanges();   // ✅ AJOUT
        setTimeout(() => {
          this.messageSuccesMdp = '';
          this.cdr.detectChanges();   // ✅ AJOUT
        }, 3000);
      },
      error: (err) => {
        this.messageErreurMdp = err.error?.message || 'Erreur lors du changement.';
        this.sauvegarde = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      }
    });
  }

  getInitiales() {
    return `${this.form.prenom?.charAt(0) || ''}${this.form.nom?.charAt(0) || ''}`;
  }

  getRoleBadge() {
    const badges: any = {
      participant:  { label: 'Participant',   color: '#1d4ed8', bg: '#eff6ff' },
      conferencier: { label: 'Conférencier',  color: '#7c3aed', bg: '#f5f3ff' },
      organisateur: { label: 'Organisateur',  color: '#16a34a', bg: '#f0fdf4' },
      admin:        { label: 'Administrateur', color: '#dc2626', bg: '#fef2f2' },
    };
    return badges[this.form.role] || { label: this.form.role, color: '#6b7280', bg: '#f3f4f6' };
  }
}