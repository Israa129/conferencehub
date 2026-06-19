import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 1. Importe ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conference } from '../../../core/models/Conference';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { ConferenceList } from '../../conferences/conference-list/conference-list';
import { DashboardOrganisateurService } from '../../../core/services/organisateur/dashboard-organisateur';
import { ListArticle } from '../list-article/list-article';

@Component({
  selector: 'app-organisateur-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ConferenceList],
  templateUrl: './organisateur-dashboard.html',
  styleUrl: './organisateur-dashboard.scss',
})
export class OrganisateurDashboard implements OnInit {

  conferences: Conference[] = [];
  loading = false;
  
  stats: any = null;
  loadingStats = false;

  organisateurId = 1;

  constructor(
    private conferenceService: ConferenceService, 
    private dashboardService: DashboardOrganisateurService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadStats();
  }

  load(): void {
    this.loading = true;
    this.conferenceService.getAll().subscribe({
      next: (data) => {
        this.conferences = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStats(): void {
    this.loadingStats = true;
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        console.log('Données reçues du backend :', res);
        if (res && res.success) {
          this.stats = res.data;
        }
        this.loadingStats = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Erreur stats:', err);
        this.loadingStats = false;
        this.cdr.detectChanges();  
      }
    });
  }



  isActive(conf: Conference): boolean {
    const now = new Date();
    return new Date(conf.date_debut) <= now && now <= new Date(conf.date_fin);
  }
}