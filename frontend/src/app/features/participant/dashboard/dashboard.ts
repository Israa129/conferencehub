import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ConferenceService } from '../../../services/conference.service';
import { Conference } from '../../../models/conference';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  user = {
    nom: 'Amara',
    date: new Date()
  };

  conferences: Conference[] = [];

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void {

    this.conferenceService.getConferences().subscribe({
      next: (data) => {
        this.conferences = data;
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
}