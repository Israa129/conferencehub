import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConferenceService } from '../../../core/services/conference/conference-service';
import { Conference } from '../../../core/models/Conference';

@Component({
  selector: 'app-conference-formulaire',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './conference-formulaire.html',
  styleUrl: './conference-formulaire.scss',
})
export class ConferenceFormulaire { 
  form: FormGroup;
  isEdit = false;
  conferenceId?: number;
 
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private conferenceService: ConferenceService
  ) {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      theme: ['', [Validators.required, Validators.maxLength(100)]],
      lieu: ['', [Validators.required, Validators.maxLength(150)]],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      organisateur_id: [null, Validators.required],
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
            date_debut: conf.date_debut,
            date_fin: conf.date_fin,
            organisateur_id: conf.organisateur_id,
          });
        },
        error: (error) => { console.log(error) },
      });
    }
  }
 
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
 
    const obs = this.isEdit && this.conferenceId
      ? this.conferenceService.update(this.conferenceId, payload)
      : this.conferenceService.create(payload);
 
    obs.subscribe({
      next: (conf) => this.router.navigate(['/conferences', conf.id])    });
  }
 
  get f() { return this.form.controls; }
}
