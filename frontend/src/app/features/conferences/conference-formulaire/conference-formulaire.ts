import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

import { ConferenceService } from '../../../core/services/conference/conference-service';
import { Conference } from '../../../core/models/Conference';
import { SessionService } from '../../../core/services/session/session-conference';

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
  conferenceId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conferenceService: ConferenceService,
    private sessionService: SessionService
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
        error: (error) => console.log(error),
      });

    } else {
      this.addSession();
    }
  }

  get sessions(): FormArray {
    return this.form.get('sessions') as FormArray;
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
    this.sessions.push(this.createSessionGroup());
  }

  removeSession(index: number): void {
    this.sessions.removeAt(index);
  }

  private toDateInput(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { sessions, ...conferencePayload } = this.form.value;

    this.conferenceService.create(conferencePayload).subscribe({
      next: (newConf) => {

        const conferenceId = newConf?.id;

        if (!conferenceId) {
          console.error('Conference ID manquant');
          return;
        }

        if (!sessions || sessions.length === 0) {
          this.router.navigate(['/conferences', conferenceId]);
          return;
        }

        const requests: Observable<any>[] = sessions.map((s: any) => {

          const payload = {
            titre: s.titre,
            type: s.type,
            capacite: Number(s.capacite),

            horaire_debut: new Date(s.horaireDebut).toISOString(),
            horaire_fin: new Date(s.horaireFin).toISOString(),

            conference_id: conferenceId
          };

          // 🔥 FIX TS ICI (important)
          return this.sessionService.create(payload as any);
        });

        forkJoin(requests).subscribe({
          next: () => {
            this.router.navigate(['/conferences', conferenceId]);
          },
          error: (err) => {
            console.error('Erreur création sessions:', err);
            this.router.navigate(['/conferences', conferenceId]);
          }
        });

      },
      error: (err) => {
        console.error('Erreur création conférence:', err);
      }
    });
  }

  get f() {
    return this.form.controls;
  }
}