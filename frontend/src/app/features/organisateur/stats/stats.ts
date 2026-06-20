import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthService } from '../../../core/services/auth';
import { DashboardOrganisateurService } from '../../../core/services/organisateur/dashboard-organisateur';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  @ViewChild('myChart') chartRef!: ElementRef<HTMLCanvasElement>;

  loading = true;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private organisateurDashboard: DashboardOrganisateurService
  ) {}

  ngOnInit(): void {
    const currentUser = this.auth.getUser();

    if (!currentUser?.id) {
      this.errorMessage = 'Utilisateur non connecté';
      this.loading = false;
      return;
    }

    this.organisateurDashboard.getStatsParOrganisateur(currentUser.id).subscribe({
      next: (stats) => {
        this.loading = false;
        this.renderChart(stats);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement des statistiques';
      },
    });
  }

  private renderChart(stats: { crees: number; modifiees: number }): void {
    new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Créées', 'Modifiées'],
        datasets: [
          {
            label: 'Conférences',
            data: [stats.crees, stats.modifiees],
            backgroundColor: ['#4ade80', '#60a5fa'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    });
  }
}