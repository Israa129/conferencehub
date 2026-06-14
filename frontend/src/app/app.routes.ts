import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { HomeComponent } from './features/home/home/home';
import { ConferenceFormulaire } from './features/conferences/conference-formulaire/conference-formulaire';
import { ConferenceDetails } from './features/conferences/conference-details/conference-details';
import { ConferenceList } from './features/conferences/conference-list/conference-list';
import { ConferencierDashboardComponent } from './features/conferencier/conferencier-dashboard/conferencier-dashboard';
import { ConferencierLayout } from './features/conferencier/conferencier-layout/conferencier-layout';
import { Dashboard } from './features/participant/dashboard/dashboard';
import { QrCode } from './features/participant/qr-code/qr-code';
import { Certificates } from './features/participant/certificates/certificates';
import { Settings } from './features/participant/settings/settings';
import { OrganisateurDashboard } from './features/organisateur/organisateur-dashboard/organisateur-dashboard';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: 'participant/dashboard', component: Dashboard },
  {
    path: 'participant/my-registrations',
    loadComponent: () =>
      import('./features/participant/my-registrations/my-registrations')
        .then(m => m.MyRegistrations)
  },
  { path: 'participant/qr-code', component: QrCode },
  { path: 'participant/certificates', component: Certificates },
  { path: 'participant/settings', component: Settings },
  { path: 'participant/conferences', component: ConferenceList },

  { path: 'conferences/new', component: ConferenceFormulaire },
  { path: 'conferences/:id', component: ConferenceDetails },
  { path: 'conferences/:id/edit', component: ConferenceFormulaire },

  { path: 'organisateur', component: OrganisateurDashboard },
  { path: 'admin/dashboard', component: AdminDashboardComponent },

  {
    path: 'conferencier',
    component: ConferencierLayout,
    children: [
      { path: 'conferencier/dashboard', component: ConferencierDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];