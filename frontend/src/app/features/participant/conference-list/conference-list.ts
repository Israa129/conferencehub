import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConferenceService } from '../../../services/conference.service';
import { Conference } from '../../../models/conference';

@Component({
  selector: 'app-conference-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conference-list.html',
  styleUrls: ['./conference-list.scss']
})

export class ConferenceListComponent implements OnInit {

  conferences: Conference[] = [];

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit(): void {

    this.conferenceService.getConferences().subscribe({

      next: (data) => {
        console.log(data);
        this.conferences = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}