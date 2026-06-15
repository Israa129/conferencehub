import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { Conference } from '../../../core/models/Conference';

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

  conferences = signal<Conference[]>([]);
  isLoaded = signal(false);

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.conferenceService.getAll().subscribe({
      next: (data) => {
        this.conferences.set(data);
        this.isLoaded.set(true);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des conférences :', err);
        this.isLoaded.set(true);
      }
    });
  }

  get conferencesFiltrees(): Conference[] {
    let result = this.conferences();

    if (this.recherche.trim()) {
      const q = this.recherche.toLowerCase();
      result = result.filter(c =>
        c.titre?.toLowerCase().includes(q) ||
        c.lieu?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    if (this.filtreTheme) {
      const themeLower = this.filtreTheme.toLowerCase();
      result = result.filter(c => c.theme?.toLowerCase().includes(themeLower));
    }

    if (this.filtreStatut) {
      result = result.filter(c => this.getStatutKey(c) === this.filtreStatut);
    }

    if (this.tri === 'recent') {
      result = [...result].sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
    } else if (this.tri === 'ancien') {
      result = [...result].sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime());
    }

    return result;
  }

  getStatutKey(c: Conference): 'ouvert' | 'bientot' {
    const now = new Date();
    return new Date(c.date_debut) <= now ? 'ouvert' : 'bientot';
  }

  resetFiltres(): void {
    this.recherche = '';
    this.filtreTheme = '';
    this.filtreStatut = '';
    this.tri = 'recent';
  }
}