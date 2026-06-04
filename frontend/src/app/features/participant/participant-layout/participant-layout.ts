import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-participant-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './participant-layout.html',
  styleUrl: './participant-layout.scss',
})
export class ParticipantLayout {}