import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  recherche = '';
  filtreTheme = '';
  filtreStatut = '';
  tri = 'recent';

  themes = ['Informatique & IA', 'Médecine', 'Physique', 'Droit', 'Sciences des données'];
  tendances = ['Informatique', 'Intelligence Artificielle', 'Médecine', 'Physique', 'Droit'];

  conferences: any[] = [];
  conferencesFiltrees: any[] = [];

  // Données statiques pour l'instant
  conferencesDemo = [
    {
      id: 1,
      titre: 'ICIA 2025 — International Conference on Intelligent Architectures',
      theme: 'IA & Machine Learning',
      organisateur: "Université Paris-Saclay & ENS Lyon · IEEE",
      lieu: 'Paris, France',
      date_debut: '2025-11-14',
      date_fin: '2025-11-17',
      statut: 'ouvert',
      type: 'Présentiel',
      capacite: 400,
      inscrits: 312,
      soumission: '30 sept.',
    },
    {
      id: 2,
      titre: 'DataScience World Forum 2025',
      theme: 'Sciences des données',
      organisateur: 'MIT Media Lab & Sorbonne Université',
      lieu: 'Boston, USA + En ligne',
      date_debut: '2025-12-03',
      date_fin: '2025-12-05',
      statut: 'ouvert',
      type: 'Hybride',
      capacite: 500,
      inscrits: 200,
      soumission: '15 oct. 2025',
    },
    {
      id: 3,
      titre: 'MedTech Innovation Summit 2025',
      theme: 'Médecine',
      organisateur: 'WHO & Université de Genève',
      lieu: 'Genève, Suisse',
      date_debut: '2026-01-20',
      date_fin: '2026-01-22',
      statut: 'bientot',
      type: 'Présentiel',
      capacite: 300,
      inscrits: 50,
      soumission: '1 déc. 2025',
    },
    {
      id: 4,
      titre: 'PhysicsWorld Conference 2026',
      theme: 'Physique',
      organisateur: 'CERN & ENS Paris',
      lieu: 'Genève, Suisse',
      date_debut: '2026-02-10',
      date_fin: '2026-02-12',
      statut: 'ouvert',
      type: 'En ligne',
      capacite: 1000,
      inscrits: 450,
      soumission: '15 jan. 2026',
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.conferences = this.conferencesDemo;
    this.conferencesFiltrees = this.conferences;
  }

  filtrer() {
    this.conferencesFiltrees = this.conferences.filter(c => {
      const matchRecherche = !this.recherche ||
        c.titre.toLowerCase().includes(this.recherche.toLowerCase()) ||
        c.lieu.toLowerCase().includes(this.recherche.toLowerCase());
      const matchTheme = !this.filtreTheme || c.theme === this.filtreTheme;
      const matchStatut = !this.filtreStatut || c.statut === this.filtreStatut;
      return matchRecherche && matchTheme && matchStatut;
    });
  }

  getCapacitePercent(c: any) {
    return Math.round((c.inscrits / c.capacite) * 100);
  }

  getCapaciteColor(c: any) {
    const pct = this.getCapacitePercent(c);
    if (pct >= 90) return '#ef4444';
    if (pct >= 70) return '#f59e0b';
    return '#22c55e';
  }

  resetFiltres() {
    this.recherche = '';
    this.filtreTheme = '';
    this.filtreStatut = '';
    this.conferencesFiltrees = this.conferences;
  }
}