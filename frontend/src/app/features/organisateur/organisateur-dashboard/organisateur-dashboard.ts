import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conference } from '../../../core/models/Conference';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { ConferenceList } from '../../conferences/conference-list/conference-list';

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

  totalSessions = 8;
  totalParticipants = 312;
  activeConferenceCount = 2;

  organisateurId = 1;

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.conferenceService.getAll().subscribe({
      next: (data) => {
        this.conferences = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  edit(conf: Conference): void {
   
  }

  delete(id: number): void {
    
  }

  isActive(conf: Conference): boolean {
    const now = new Date();
    return new Date(conf.date_debut) <= now && now <= new Date(conf.date_fin);
  }

}