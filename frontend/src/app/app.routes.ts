import { Routes } from '@angular/router';
import { ConferencierDashboardComponent } from './conferencier/conferencier-dashboard/conferencier-dashboard.component';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

import { ConferenceFormulaire } from './features/conferences/conference-formulaire/conference-formulaire';
import { ConferenceDetails } from './features/conferences/conference-details/conference-details';
import { ConferenceList } from './features/conferences/conference-list/conference-list';

import { Dashboard } from './features/participant/dashboard/dashboard';
import { QrCode } from './features/participant/qr-code/qr-code';
import { Certificates } from './features/participant/certificates/certificates';
import { Profile } from './features/participant/profile/profile';
import { Settings } from './features/participant/settings/settings';
import { ParticipantLayout } from './features/participant/participant-layout/participant-layout';
import { OrganisateurDashboard } from './features/organisateur/organisateur-dashboard/organisateur-dashboard';

export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: ParticipantLayout,
    children: [
      { path: 'dashboard', component: Dashboard },

      {
        path: 'my-registrations',
        loadComponent: () =>
          import('./features/participant/my-registrations/my-registrations')
            .then(m => m.MyRegistrations)
      },

      { path: 'qr-code', component: QrCode },
      { path: 'certificates', component: Certificates },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings }
    ]
  },

  { path: 'conferences/new', component: ConferenceFormulaire },
  { path: 'conferences/:id', component: ConferenceDetails },
  { path: 'conferences/:id/edit', component: ConferenceFormulaire },
  { path: 'organisateur', component: OrganisateurDashboard },


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