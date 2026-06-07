import { Routes } from '@angular/router';
import { ConferencierDashboardComponent } from './conferencier/conferencier-dashboard/conferencier-dashboard.component';

export const routes: Routes = [
  {
    path: 'conferencier',
    children: [
      {
        path: 'dashboard',
        component: ConferencierDashboardComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/conferencier/dashboard',
    pathMatch: 'full'
  }
];