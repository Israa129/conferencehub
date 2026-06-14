import { Component } from '@angular/core';

@Component({
  selector: 'app-qr-code',
  imports: [],
  templateUrl: './qr-code.html',
  styleUrl: './qr-code.scss',
})
export class QrCode {

  qrData = {
    conference: 'ICIA 2025',
    participant: 'Amara',
    status: 'Actif'
  };

}