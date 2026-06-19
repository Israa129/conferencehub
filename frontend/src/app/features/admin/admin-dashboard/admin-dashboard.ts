import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private auth: AuthService,
    private cdr: ChangeDetectorRef   // ✅ AJOUT
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getUser();
    this.loadDashboard();
  }

  loadDashboard() {
    this.chargement = true;
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.utilisateurs = data.utilisateurs.data;
        this.pagination = data.utilisateurs;
        this.chargement = false;
        this.cdr.detectChanges();   // ✅ AJOUT — force le re-rendu
      },
      error: (err) => {
        console.error('Erreur dashboard:', err);
        this.chargement = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      }
    });
  }

  loadUtilisateurs() {
    this.chargement = true;
    const params: any = {};
    if (this.search) params.search = this.search;
    if (this.filtreRole) params.role = this.filtreRole;
    if (this.filtreStatut) params.statut = this.filtreStatut;

    this.adminService.getDashboard(params).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.utilisateurs = data.utilisateurs.data;
        this.pagination = data.utilisateurs;
        this.chargement = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();   // ✅ AJOUT
      }
    });
  }

  updateRole(user: any, newRole: string) {
    this.adminService.updateRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
        this.cdr.detectChanges();
      }
    });
  }

  toggleStatut(user: any) {
    this.adminService.toggleStatut(user.id).subscribe({
      next: () => {
        user.statut = user.statut === 'bloque' ? 'actif' : 'bloque';
        if (this.stats) {
          this.stats.comptes_bloques = this.utilisateurs
            .filter(u => u.statut === 'bloque').length;
        }
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser(user: any) {
    if (!confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) return;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter(u => u.id !== user.id);
        if (this.stats) this.stats.utilisateurs_total--;
        this.cdr.detectChanges();
      }
    });
  }

  getInitiales(user: any) {
    return `${user?.prenom?.charAt(0) || ''}${user?.nom?.charAt(0) || ''}`;
  }

  onSearch() {
    this.loadUtilisateurs();
  }
}