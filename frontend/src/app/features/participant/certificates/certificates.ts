import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../../core/services/participant.service';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificates.html',
  styleUrl: './certificates.scss',
})
export class Certificates implements OnInit {

  inscriptions: any[] = [];
  loading = true;
  erreur = false;

  constructor(
    private participantService: ParticipantService,
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
        // Seules les inscriptions avec pdf_inscription disponible
        this.inscriptions = data.inscriptions ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erreur = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  telechargerPDF(ins: any) {
    if (ins.pdf_url) {
      const a = document.createElement('a');
      a.href = ins.pdf_url;
      a.download = `attestation-${ins.conference?.nom ?? 'conference'}.pdf`;
      a.target = '_blank';
      a.click();
    }
  }

  aAttestation(ins: any): boolean {
    return !!ins.pdf_url;
  }
}