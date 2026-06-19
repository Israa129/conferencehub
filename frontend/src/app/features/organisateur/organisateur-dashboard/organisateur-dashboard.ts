import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conference } from '../../../core/models/Conference';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { ConferenceList } from '../../conferences/conference-list/conference-list';
import { DashboardOrganisateurService } from '../../../core/services/organisateur/dashboard-organisateur';

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

  userId: number | null = null;
  userRole: string | null = null;

  constructor(
    private conferenceService: ConferenceService, 
    private dashboardService: DashboardOrganisateurService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.loadConferences();
    this.loadStats();
  }

  private initUser(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        this.userId = userObj.id;
        this.userRole = userObj.role;
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }

  loadConferences(): void {
    this.loading = true;

    const fetch$ = (this.userRole === 'organisateur' && this.userId)
      ? this.conferenceService.getByOrganisateur(this.userId)
      : this.conferenceService.getAll();

    fetch$.subscribe({
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
    if (!this.userId) {
      this.cdr.detectChanges();
      return;
    }

    this.loadingStats = true;
    this.dashboardService.getStats(this.userId).subscribe({
      next: (res) => {
        if (res?.success) {
          this.stats = res.data;
        }
        this.loadingStats = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching stats:', err);
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