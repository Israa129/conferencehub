import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Conference } from '../../../core/models/Conference';
import { SessionConference } from '../../../core/models/SessionConference';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { SessionService } from '../../../core/services/session/session-conference';
import { AuthService } from '../../../core/services/auth';

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
  deletingSessionId?: number;
  currentUser: any;
  organisateurName="";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conferenceService: ConferenceService,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getUser();
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

        this.loadSessions(id);
        this.loadOrganisateurName(conf.organisateur_id);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      },
    });
  }

  loadOrganisateurName(organisateurId: number): void {
    if (!organisateurId) {
      return;
    }

    this.auth.getNameById(organisateurId).subscribe({
      next: (res) => {
        this.organisateurName = res.name;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

   get isParticipant(): boolean {
    return this.auth.getUser()?.role === 'participant';
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

    this.deletingSessionId = session.id;

    this.sessionService.delete(session.id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter(
          (s) => s.id !== session.id
        );
        this.deletingSessionId = undefined;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
        this.deletingSessionId = undefined;
      },
    });
  }
  
  get canManage(): boolean {
    const role = this.currentUser?.role;
    return role === 'organisateur' || role === 'admin';
  }
}