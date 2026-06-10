import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  utilisateurs: any[] = [];
  pagination: any = null;
  chargement = true;

  search = '';
  filtreRole = '';
  filtreStatut = '';

  currentUser: any = null;

  roles = ['participant', 'conferencier', 'organisateur', 'admin'];

  constructor(
    private adminService: AdminService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.loadStats();
    this.loadUtilisateurs();
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });
  }

  loadUtilisateurs() {
    this.chargement = true;
    const params: any = {};
    if (this.search) params.search = this.search;
    if (this.filtreRole) params.role = this.filtreRole;
    if (this.filtreStatut) params.statut = this.filtreStatut;

    this.adminService.getUtilisateurs(params).subscribe({
      next: (data) => {
        this.utilisateurs = data.data;
        this.pagination = data;
        this.chargement = false;
      },
      error: (err) => {
        console.error(err);
        this.chargement = false;
      }
    });
  }

  updateRole(user: any, newRole: string) {
    this.adminService.updateRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
      }
    });
  }

  toggleStatut(user: any) {
    this.adminService.toggleStatut(user.id).subscribe({
      next: () => {
        user.statut = user.statut === 'bloque' ? 'actif' : 'bloque';
      }
    });
  }

  deleteUser(user: any) {
    if (confirm(`Supprimer le compte de ${user.prenom} ${user.nom} ?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.utilisateurs = this.utilisateurs.filter(u => u.id !== user.id);
          this.stats.utilisateurs_total--;
        }
      });
    }
  }

  getInitiales(user: any) {
    return `${user.prenom?.charAt(0) || ''}${user.nom?.charAt(0) || ''}`;
  }

  onSearch() {
    this.loadUtilisateurs();
  }
}