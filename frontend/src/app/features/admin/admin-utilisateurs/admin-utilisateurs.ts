import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-utilisateurs.html',
  styleUrl: './admin-utilisateurs.scss',
})
export class AdminUtilisateurs implements OnInit {
  utilisateurs: any[] = [];
  pagination: any = null;
  chargement = true;

  search = '';
  filtreRole = '';
  filtreStatut = '';
  roles = ['participant', 'conferencier', 'organisateur', 'admin'];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.chargement = true;

    const params: any = {};
    if (this.search) params.search = this.search;
    if (this.filtreRole) params.role = this.filtreRole;
    if (this.filtreStatut) params.statut = this.filtreStatut;

    this.adminService.getDashboard(params).subscribe({
      next: (data) => {
        this.utilisateurs = data.utilisateurs.data;
        this.pagination = data.utilisateurs;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur utilisateurs:', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    this.loadUtilisateurs();
  }

  updateRole(user: any, newRole: string) {
    this.adminService.updateRole(user.id, newRole).subscribe(() => {
      user.role = newRole;
      this.cdr.detectChanges();
    });
  }

  toggleStatut(user: any) {
    this.adminService.toggleStatut(user.id).subscribe(() => {
      user.statut = user.statut === 'bloque' ? 'actif' : 'bloque';
      this.cdr.detectChanges();
    });
  }

  deleteUser(user: any) {
    if (!confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;

    this.adminService.deleteUser(user.id).subscribe(() => {
      this.utilisateurs = this.utilisateurs.filter(u => u.id !== user.id);
      this.cdr.detectChanges();
    });
  }

  getInitiales(user: any) {
    return `${user?.prenom?.charAt(0) || ''}${user?.nom?.charAt(0) || ''}`;
  }
}