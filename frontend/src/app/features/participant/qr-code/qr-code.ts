import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../../../core/services/participant.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code.html',
  styleUrl: './qr-code.scss',
})
export class QrCode implements OnInit {

  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  loading = true;
  qrData: any = null;

  constructor(
    private participantService: ParticipantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loading = true;

    this.participantService.getQrCode().subscribe({
      next: (data) => {
        this.qrData = data;
        this.loading = false;
        this.cdr.detectChanges();

        // Attendre que le canvas soit rendu dans le DOM
        setTimeout(() => this.genererQR(data.qrData), 100);
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  genererQR(data: string) {
    if (!this.qrCanvas?.nativeElement) return;

    QRCode.toCanvas(this.qrCanvas.nativeElement, data, {
      width: 220,
      margin: 2,
      color: { dark: '#4f46e5', light: '#ffffff' }
    });
  }

  telecharger() {
    const canvas = this.qrCanvas.nativeElement;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${this.qrData?.participant ?? 'participant'}.png`;
    a.click();
  }

  async partager() {
    try {
      const canvas = this.qrCanvas.nativeElement;
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob(b => resolve(b!), 'image/png')
      );

      const fichier = new File([blob], `qr-${this.qrData?.participant}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [fichier] })) {
        await navigator.share({
          title: `QR Code — ${this.qrData?.conference}`,
          text: `Mon QR Code de présence\nParticipant : ${this.qrData?.participant}`,
          files: [fichier],
        });
      } else {
        // Fallback : copier dans le presse-papier
        await navigator.clipboard.writeText(
          `QR Code — ${this.qrData?.conference}\nParticipant : ${this.qrData?.participant}`
        );
        alert('Informations copiées dans le presse-papier !');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        await navigator.clipboard.writeText(this.qrData?.participant ?? '');
      }
    }
  }
}