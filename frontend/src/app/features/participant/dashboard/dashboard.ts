import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../../core/services/participant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {

  loading = true;
  erreur = false;
  today = new Date();

  user: any = null;
  inscription: any = null;
  inscriptions: any[] = [];
  steps: any[] = [];
  prochainEvenement: any = null;
  qrCodeUrl: string | null = null;
  countdown = { jours: 0, heures: 0, minutes: 0 };

  // États UI
  partageEnCours = false;
  messagePartage: string | null = null;

  private timer: any;

  constructor(
    private participantService: ParticipantService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  get inscriptionsConfirmees(): number {
  return this.inscriptions.filter(i => i.statut === 'confirmé').length;
}

get attestationsDisponibles(): number {
  return this.inscriptions.filter(i => i.pdf_url).length;
}

  ngOnInit() {
    this.chargerDashboard();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  chargerDashboard() {
    this.loading = true;
    this.erreur = false;

    this.participantService.getDashboard().subscribe({
      next: (data: any) => {
        this.user              = data.user;
        this.inscription       = data.inscriptionActive;
        this.inscriptions      = data.inscriptions ?? [];
        this.steps             = data.steps ?? [];
        this.prochainEvenement = data.prochainEvenement;
        this.qrCodeUrl         = data.inscriptionActive?.qrCode ?? null;

        if (data.prochainEvenement?.countdown) {
          this.countdown = data.prochainEvenement.countdown;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('ERREUR:', err);
        this.erreur = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ─── TÉLÉCHARGER QR CODE ─────────────────────────────────────────────────
  telechargerQR() {
    const canvas = document.createElement('canvas');
    import('qrcode').then(QRCode => {
      const data = JSON.stringify({
        participantId: this.user?.participantId,
        nom: this.user?.prenom + ' ' + this.user?.nom,
        conference: this.inscription?.conference?.nom,
      });
      QRCode.toCanvas(
        canvas,
        data,
        { width: 300, color: { dark: '#4f46e5', light: '#ffffff' } },
        () => {
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-presence-${this.user?.participantId}.png`;
          a.click();
        }
      );
    });
  }

  // ─── PARTAGER QR CODE ────────────────────────────────────────────────────
  async partagerQR() {
    if (this.partageEnCours) return;
    this.partageEnCours = true;

    try {
      // Générer le QR en blob pour le partage
      const blob = await this.genererQRBlob();

      // Essayer Web Share API (mobile / navigateurs modernes)
      if (navigator.share && navigator.canShare) {
        const fichier = new File([blob], `qr-${this.user?.participantId}.png`, { type: 'image/png' });
        const peutPartagerFichier = navigator.canShare({ files: [fichier] });

        if (peutPartagerFichier) {
          await navigator.share({
            title: `QR Code — ${this.inscription?.conference?.nom}`,
            text: `Mon QR Code de présence pour ${this.inscription?.conference?.nom}\nID: ${this.user?.participantId}`,
            files: [fichier],
          });
          this.afficherMessage('QR Code partagé !', 'success');
          return;
        }

        // Partage sans fichier (texte + url)
        await navigator.share({
          title: `QR Code — ${this.inscription?.conference?.nom}`,
          text: `Mon QR Code de présence pour ${this.inscription?.conference?.nom}\nID: ${this.user?.participantId}`,
        });
        this.afficherMessage('Partagé !', 'success');
        return;
      }

      // Fallback : copier l'ID dans le presse-papier
      await this.copierDansPressePapier();

    } catch (err: any) {
      // L'utilisateur a annulé le partage — ne pas afficher d'erreur
      if (err?.name !== 'AbortError') {
        // Fallback silencieux : copie presse-papier
        await this.copierDansPressePapier();
      }
    } finally {
      this.partageEnCours = false;
      this.cdr.detectChanges();
    }
  }

  private genererQRBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      import('qrcode').then(QRCode => {
        const data = JSON.stringify({
          participantId: this.user?.participantId,
          nom: this.user?.prenom + ' ' + this.user?.nom,
          conference: this.inscription?.conference?.nom,
        });
        QRCode.toCanvas(
          canvas,
          data,
          { width: 300, color: { dark: '#4f46e5', light: '#ffffff' } },
          (err: any) => {
            if (err) { reject(err); return; }
            canvas.toBlob(blob => {
              if (blob) resolve(blob);
              else reject(new Error('Blob null'));
            }, 'image/png');
          }
        );
      }).catch(reject);
    });
  }

  private async copierDansPressePapier() {
    const texte = `QR Code de présence — ${this.inscription?.conference?.nom}\nID Participant : ${this.user?.participantId}`;
    try {
      await navigator.clipboard.writeText(texte);
      this.afficherMessage('ID copié dans le presse-papier !', 'info');
    } catch {
      this.afficherMessage('Impossible de copier. ID : ' + this.user?.participantId, 'error');
    }
  }

  private afficherMessage(msg: string, type: 'success' | 'info' | 'error') {
    this.messagePartage = msg;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.messagePartage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // ─── VOIR TOUT (inscriptions) ─────────────────────────────────────────────
  voirToutInscriptions() {
    this.router.navigate(['/participant/my-registrations']);
  }

  // ─── VOIR LE PROGRAMME ───────────────────────────────────────────────────
  voirProgramme() {
    if (this.prochainEvenement?.conferenceId) {
      this.router.navigate(['/conferences', this.prochainEvenement.conferenceId, 'programme']);
    } else {
      this.router.navigate(['/conferences']);
    }
  }

  // ─── AJOUTER À L'AGENDA ──────────────────────────────────────────────────
  ajouterAgenda() {
    if (!this.prochainEvenement) return;

    const conf = this.prochainEvenement;

    // Formatage date ICS (YYYYMMDDTHHMMSSZ)
    const formaterDateICS = (dateStr: string): string => {
      const d = new Date(dateStr);
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const debut = formaterDateICS(conf.date_debut ?? new Date().toISOString());
    const fin   = formaterDateICS(conf.date_fin   ?? new Date().toISOString());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ConferenceHub//FR',
      'BEGIN:VEVENT',
      `UID:${this.user?.participantId}-${Date.now()}@conferencehub`,
      `DTSTAMP:${formaterDateICS(new Date().toISOString())}`,
      `DTSTART:${debut}`,
      `DTEND:${fin}`,
      `SUMMARY:${conf.nom}`,
      `DESCRIPTION:Conférence : ${conf.nom}\\nID Participant : ${this.user?.participantId}`,
      `LOCATION:${conf.adresse ?? conf.ville}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${conf.nom.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);

    this.afficherMessage('Fichier agenda téléchargé !', 'success');
  }
}