import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Conference } from '../../../core/models/Conference';
import { SessionConference } from '../../../core/models/SessionConference';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { SessionService } from '../../../core/services/session/session-conference';

@Component({
  selector: 'app-conference-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './conference-details.html',
  styleUrl: './conference-details.scss',
})
export class ConferenceDetails implements OnInit {
  conference?: Conference;
  sessions: SessionConference[] = [];

  loading = true;
  loadingSessions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conferenceService: ConferenceService,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/conferences']);
      return;
    }

    this.loading = true;

    this.conferenceService.getById(id).subscribe({
      next: (conf) => {
        this.conference = conf;
        this.loading = false;

        // Charger les sessions de la conférence
        this.loadSessions(id);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  loadSessions(conferenceId: number): void {
    this.loadingSessions = true;

    this.sessionService.getByConference(conferenceId).subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.loadingSessions = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.loadingSessions = false;
      },
    });
  }

  delete(): void {
    if (!this.conference || !confirm('Supprimer cette conférence ?')) {
      return;
    }

    this.conferenceService.delete(this.conference.id).subscribe({
      next: () => {
        this.router.navigate(['/conferences']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteSession(session: SessionConference): void {
    if (!confirm(`Supprimer la session "${session.titre}" ?`)) {
      return;
    }

    this.sessionService.delete(session.id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter(
          (s) => s.id !== session.id
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}