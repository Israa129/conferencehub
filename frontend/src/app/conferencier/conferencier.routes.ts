// ============================================================
// ROUTING CONFÉRENCIER — à ajouter dans app.routes.ts
// Colle ce bloc dans le tableau routes[] de ton app.routes.ts
// sans modifier les routes des autres
// ============================================================

import { Routes } from '@angular/router';
import { ConferencierDashboardComponent } from './conferencier-dashboard/conferencier-dashboard.component';

// Ajoute ces routes dans ton tableau routes existant :
export const conferencierRoutes: Routes = [
  {
    path: 'conferencier',
    children: [
      {
        path: 'dashboard',
        component: ConferencierDashboardComponent,
        // décommente la ligne suivante si l'auth guard est déjà créé par un autre membre :
        // canActivate: [AuthGuard],
        // data: { role: 'CONFERENCIER' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

// ─── Dans ton app.routes.ts, ajoute simplement :
// import { conferencierRoutes } from './conferencier.routes';
// puis dans le tableau routes : ...conferencierRoutes