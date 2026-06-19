import { Component, OnInit, signal, computed } from '@angular/core';
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
    const now = new Date();

    // 1. Filtrage par texte (Recherche)
    if (this.recherche.trim()) {
      const q = this.recherche.toLowerCase();
      result = result.filter(c =>
        c.titre?.toLowerCase().includes(q) ||
        c.lieu?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    // 2. Filtrage par Thème
    if (this.filtreTheme) {
      const themeLower = this.filtreTheme.toLowerCase();
      result = result.filter(c => c.theme?.toLowerCase().includes(themeLower));
    }

    // 3. FIX : Filtrage par Statut (Passé/En cours VS À venir)
    if (this.filtreStatut) {
      if (this.filtreStatut === 'ouvert') {
        // Débutées ou Passées : Date de début est passée ou égale à aujourd'hui
        result = result.filter(c => new Date(c.date_debut) <= now);
      } else if (this.filtreStatut === 'bientot') {
        // À venir : Date de début dans le futur
        result = result.filter(c => new Date(c.date_debut) > now);
      }
    }

    // 4. Tri des données
    if (this.tri === 'recent') {
      result = [...result].sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
    } else if (this.tri === 'ancien') {
      result = [...result].sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime());
    }

    return result;
  }

  resetFiltres(): void {
    this.recherche = '';
    this.filtreTheme = '';
    this.filtreStatut = '';
    this.tri = 'recent';
  }

  // Permet l'affichage dynamique des badges sur les cartes (Optionnel mais recommandé pour la clarté)
  getBadgeStatus(conf: Conference): 'active' | 'termine' | 'avenir' {
    const now = new Date();
    const debut = new Date(conf.date_debut);
    const fin = new Date(conf.date_fin);

    if (debut > now) return 'avenir';
    if (debut <= now && now <= fin) return 'active';
    return 'termine';
  }
}