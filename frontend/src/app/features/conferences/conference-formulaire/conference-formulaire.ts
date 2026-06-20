import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

import { ConferenceService } from '../../../core/services/conference/conference-service';
import { Conference } from '../../../core/models/Conference';
import { SessionService } from '../../../core/services/session/session-conference';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-conference-formulaire',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './conference-formulaire.html',
  styleUrl: './conference-formulaire.scss',
})
export class ConferenceFormulaire implements OnInit {
  form: FormGroup;
  isEdit = false;
  isSessionOnly = false;
  conferenceId?: number;
  
  // 💡 Gestion des états d'erreur globaux et de chargement
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conferenceService: ConferenceService,
    private sessionService: SessionService,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      theme: ['', [Validators.required, Validators.maxLength(100)]],
      lieu: ['', [Validators.required, Validators.maxLength(150)]],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      organisateur_id: [null, Validators.required],
      sessions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.setCurrentOrganisateur();

    const conferenceId = Number(this.route.snapshot.queryParamMap.get('conferenceId'));

    if (conferenceId) {
      this.isSessionOnly = true;
      this.conferenceId = conferenceId;
      this.disableConferenceFields();
      this.addSession();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.conferenceId = Number(id);

      this.conferenceService.getById(this.conferenceId).subscribe({
        next: (conf: Conference) => {
          this.form.patchValue({
            titre: conf.titre,
            description: conf.description,
            theme: conf.theme,
            lieu: conf.lieu,
            date_debut: this.toDateInput(conf.date_debut),
            date_fin: this.toDateInput(conf.date_fin),
            organisateur_id: conf.organisateur_id,
          });
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = "Impossible de charger les données de la conférence.";
        },
      });

    } else {
      this.addSession();
    }
  }

  get sessions(): FormArray {
    return this.form.get('sessions') as FormArray;
  }

  get f() {
    return this.form.controls;
  }

  // Helper pour cibler les validateurs d'une session spécifique dans le HTML
  getSessionControls(index: number) {
    return (this.sessions.at(index) as FormGroup).controls;
  }

  createSessionGroup(): FormGroup {
    return this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      horaireDebut: ['', Validators.required],
      horaireFin: ['', Validators.required],
      capacite: [50, [Validators.required, Validators.min(1)]]
    });
  }

  addSession(): void {
    this.errorMessage = null;
    this.sessions.push(this.createSessionGroup());
  }

  removeSession(index: number): void {
    this.sessions.removeAt(index);
  }

  submit(): void {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire avant de soumettre.";
      return;
    }

    this.isSubmitting = true;
    const { sessions, ...conferencePayload } = this.form.value;

    if (this.isSessionOnly && this.conferenceId) {
      this.createSessions(this.conferenceId, sessions);
      return;
    }

    if (this.isEdit && this.conferenceId) {
      this.conferenceService.update(this.conferenceId, conferencePayload).subscribe({
        next: () => {
          this.router.navigate(['/conferences', this.conferenceId]);
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Erreur modification conference:', err);
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de la modification.";
        }
      });
      return;
    }

    this.conferenceService.create(conferencePayload).subscribe({
      next: (newConf) => {
        const conferenceId = newConf?.id;

        if (!conferenceId) {
          this.isSubmitting = false;
          this.errorMessage = "La conférence a été créée mais l'identifiant de retour est introuvable.";
          return;
        }

        if (!sessions || sessions.length === 0) {
          this.router.navigate(['/conferences', conferenceId]);
          return;
        }

        this.createSessions(conferenceId, sessions);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur creation conference:', err);
        this.errorMessage = err.error?.message || "Erreur serveur lors de la création de la conférence.";
      }
    });
  }

  private createSessions(conferenceId: number, sessions: any[]): void {
    const requests: Observable<any>[] = sessions.map((s: any) => {
      const payload = {
        titre: s.titre,
        type: s.type,
        capacite: Number(s.capacite),
        horaire_debut: new Date(s.horaireDebut).toISOString(),
        horaire_fin: new Date(s.horaireFin).toISOString(),
        conference_id: conferenceId
      };

      return this.sessionService.create(payload as any);
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.router.navigate(['/conferences', conferenceId]);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur creation sessions:', err);
        this.errorMessage = "La conférence a bien été enregistrée, mais une ou plusieurs sessions n'ont pas pu être créées.";
      }
    });
  }

  private disableConferenceFields(): void {
    ['titre', 'description', 'theme', 'lieu', 'date_debut', 'date_fin', 'organisateur_id']
      .forEach((controlName) => this.form.get(controlName)?.disable());
  }

  private setCurrentOrganisateur(): void {
    const user = this.auth.getUser();
    if (!user?.id) return;

    this.form.patchValue({
      organisateur_id: user.id
    });
  }

  private toDateInput(date: string | Date): string {
    if (!date) return '';
    // Format requis pour datetime-local : YYYY-MM-DDTHH:mm
    const d = new Date(date);
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}