import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences(): void {
    this.conferenceService.getAll().subscribe({
      next: (data) => {
        this.conferences.set(data);
        this.loaded.set(true);
        console.log('Conferences loaded:', this.conferences());
      },
      error: (err) => {
        console.error(err);
        this.loaded.set(true);
      }
    });
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

  onEdit(conf: Conference): void {}

  onDelete(id: number): void {}
}