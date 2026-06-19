import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { Conference } from '../../../core/models/Conference';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.scss',
})
export class ConferenceList implements OnInit {

  searchQuery = '';
  conferences = signal<Conference[]>([]);
  loaded = signal(false);

  constructor(
    private conferenceService: ConferenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
  const userString = localStorage.getItem('user');

  let role: string | null = null;
  let userId: number | null = null;
  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      role = userObj.role; 
      userId = userObj.id;
    } catch (e) {
      console.error("Erreur lors du parsing de l'objet utilisateur", e);
    }
  }

  if (role === 'organisateur' && userId) {
    this.conferenceService.getByOrganisateur(userId).subscribe({
      next: (data) => this.handleSuccess(data),
      error: (err) => {
        console.error(err);
        this.loaded.set(true);
      }
    });
  } else {
    this.conferenceService.getAll().subscribe({
      next: (data) => this.handleSuccess(data),
      error: (err) => {
        console.error(err);
        this.loaded.set(true);
      }
    });
  }
}
  private handleSuccess(data: Conference[]): void {
    this.conferences.set(data);
    this.loaded.set(true);
  }

  get filteredConferences(): Conference[] {
    if (!this.searchQuery.trim()) return this.conferences();
    const q = this.searchQuery.toLowerCase();
    return this.conferences().filter(c =>
      c.titre?.toLowerCase().includes(q) ||
      c.theme?.toLowerCase().includes(q) ||
      c.lieu?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  }

  isActive(conf: Conference): boolean {
    const now = new Date();
    return new Date(conf.date_debut) <= now && now <= new Date(conf.date_fin);
  }

  onEdit(conf: Conference): void {
    this.router.navigate(['/conferences', conf.id, 'edit']);
  }

  onDelete(id: number): void {
    if (!confirm('Supprimer cette conférence ?')) return;

    this.conferenceService.delete(id).subscribe({
      next: () => {
        this.conferences.update(list => list.filter(c => c.id !== id));
      },
      error: (err) => console.error('Erreur suppression', err)
    });
  }
}