import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password';
import { HomeComponent } from './features/home/home/home';
import { ConferenceFormulaire } from './features/conferences/conference-formulaire/conference-formulaire';
import { ConferenceDetails } from './features/conferences/conference-details/conference-details';
import { ConferenceList } from './features/conferences/conference-list/conference-list';
import { ConferencierDashboard } from './features/conferencier/conferencier-dashboard/conferencier-dashboard';
import { ConferencierLayout } from './features/conferencier/conferencier-layout/conferencier-layout';
import { Dashboard } from './features/participant/dashboard/dashboard';
import { QrCode } from './features/participant/qr-code/qr-code';
import { Certificates } from './features/participant/certificates/certificates';
import { OrganisateurDashboard } from './features/organisateur/organisateur-dashboard/organisateur-dashboard';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { ProfilePageComponent } from './features/profile/profile-page/profile-page';
import { ValidationArticle } from './features/organisateur/validation-article/validation-article';
import { ListArticle } from './features/organisateur/list-article/list-article';
import { AdminUtilisateurs } from './features/admin/admin-utilisateurs/admin-utilisateurs';
import { Analytics } from './features/admin/analytics/analytics';
import { JournauxAudit } from './features/admin/journaux-audit/journaux-audit';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: 'profile', component: ProfilePageComponent },

  { path: 'participant/dashboard', component: Dashboard },
  {
    path: 'participant/my-registrations',
    loadComponent: () =>
      import('./features/participant/my-registrations/my-registrations')
        .then(m => m.MyRegistrations)
  },
  { path: 'participant/qr-code', component: QrCode },
  { path: 'participant/certificates', component: Certificates },
  { path: 'participant/conferences', component: ConferenceList },

  { path: 'organisateur/dashboard', component: OrganisateurDashboard },
  { path: 'organisateur/conferences', component: ConferenceList },
  { path: 'organisateur/validation-articles', component: ValidationArticle },
  { path: 'organisateur/list-articles', component: ListArticle },


  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/utilisateurs', component: AdminUtilisateurs },
  { path: 'admin/conferences', component: AdminDashboardComponent },
  { path: 'admin/roles', component: AdminDashboardComponent },
  { path: 'admin/analytics', component: Analytics },
  { path: 'admin/logs', component: JournauxAudit },
  { path: 'admin/parametres', component: AdminDashboardComponent },
  { path: 'admin/mailing', component: AdminDashboardComponent },
  { path: 'admin/create-user', component: RegisterComponent },
  { path: 'conferences', component: ConferenceList },
  { path: 'conferences/new', component: ConferenceFormulaire },
  { path: 'conferences/:id/edit', component: ConferenceFormulaire },
  { path: 'conferences/:id', component: ConferenceDetails },

  {
    path: 'conferencier',
    component: ConferencierLayout,
    children: [
      { path: 'dashboard',  component: ConferencierDashboard, data: { mode: 'dashboard' } },
      { path: 'articles',   component: ConferencierDashboard, data: { mode: 'articles' } },
      { path: 'archives',   component: ConferencierDashboard, data: { mode: 'archives' } },
      { path: 'soumettre',  component: ConferencierDashboard, data: { mode: 'soumettre' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: 'sessions/new', component: ConferenceFormulaire },

  { path: '**', redirectTo: '' }
];
