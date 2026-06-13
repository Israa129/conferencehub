import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.scss',
})
export class MyRegistrations {

  registrations = [
    {
      title: 'ICIA 2025',
      location: 'Paris',
      status: 'Confirmée'
    },
    {
      title: 'DataScience World Forum',
      location: 'Lyon',
      status: 'En attente'
    }
  ];

}