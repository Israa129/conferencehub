import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ConferenceFormulaire } from './features/conferences/conference-formulaire/conference-formulaire';
import { ConferenceDetails } from './features/conferences/conference-details/conference-details';
import { ConferenceList } from './features/conferences/conference-list/conference-list';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path:'conferences', component: ConferenceList },
  { path:'conferences/new', component: ConferenceFormulaire },
  { path:'conferences/:id', component: ConferenceDetails },
  { path:'conferences/:id/edit', component: ConferenceFormulaire }
];