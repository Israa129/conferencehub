import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics implements OnInit, AfterViewInit {
  @ViewChild('connexionsCanvas') connexionsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rolesCanvas') rolesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('actionsCanvas') actionsCanvas!: ElementRef<HTMLCanvasElement>;

  data: any = null;
  chargement = true;
  periode = 7;

  private chartConnexions?: Chart;
  private chartRoles?: Chart;
  private chartActions?: Chart;
  private vueInitialisee = false;

  constructor(
    private service: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    this.vueInitialisee = true;
    if (this.data) {
      this.renderCharts();
    }
  }

  load() {
    this.chargement = true;
    this.service.getAnalytics(this.periode).subscribe({
      next: (data) => {
        this.data = data;
        this.chargement = false;
        this.cdr.detectChanges();
        if (this.vueInitialisee) {
          setTimeout(() => this.renderCharts());
        }
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  changerPeriode(jours: number) {
    this.periode = jours;
    this.load();
  }

  private renderCharts() {
    this.chartConnexions?.destroy();
    this.chartRoles?.destroy();
    this.chartActions?.destroy();

    this.chartConnexions = new Chart(this.connexionsCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.data.connexions_par_jour.map((d: any) =>
          new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })),
        datasets: [{
          label: 'Connexions',
          data: this.data.connexions_par_jour.map((d: any) => d.total),
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(29, 78, 216, 0.08)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    this.chartRoles = new Chart(this.rolesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.data.connexions_par_role.map((d: any) => this.roleLabel(d.role)),
        datasets: [{
          data: this.data.connexions_par_role.map((d: any) => d.total),
          backgroundColor: ['#1d4ed8', '#7c3aed', '#16a34a', '#dc2626']
        }]
      },
      options: { responsive: true }
    });

    this.chartActions = new Chart(this.actionsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.data.actions_par_type.map((d: any) => d.action),
        datasets: [{
          label: 'Occurrences',
          data: this.data.actions_par_type.map((d: any) => d.total),
          backgroundColor: '#7c3aed'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  roleLabel(role: string): string {
    const labels: any = {
      participant: 'Participant',
      conferencier: 'Conférencier',
      organisateur: 'Organisateur',
      admin: 'Admin'
    };
    return labels[role] || role;
  }
}