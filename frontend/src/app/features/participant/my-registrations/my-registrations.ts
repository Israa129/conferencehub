import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParticipantService } from '../../../core/services/participant.service';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.scss',
})
export class MyRegistrations implements OnInit {

  inscriptions: any[] = [];
  loading = true;
  erreur = false;

  constructor(
    private participantService: ParticipantService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading = true;
    this.erreur = false;

    this.participantService.getInscriptions().subscribe({
      next: (data: any) => {
        this.inscriptions = data.inscriptions ?? [];
        this.loading = false;
        this.cdr.detectChanges(); // ← ajout
      },
      error: () => {
        this.erreur = true;
        this.loading = false;
        this.cdr.detectChanges(); // ← ajout
      }
    });
  }

  voirConference(conferenceId: number) {
    this.router.navigate(['/conferences', conferenceId]);
  }

  voirConferences() {
    this.router.navigate(['/participant/conferences']);
  }

  retourDashboard() {
    this.router.navigate(['/participant/dashboard']);
  }
}