import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificates.html',
  styleUrl: './certificates.scss',
})
export class Certificates {

  certificates = [
    {
      conference: 'ICIA 2025',
      date: '14 Novembre 2025'
    },
    {
      conference: 'DataScience World Forum',
      date: '5 Décembre 2025'
    }
  ];

}