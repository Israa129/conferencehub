import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private baseUrl = 'http://127.0.0.1:8000/api/participant';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
      Accept: 'application/json',
    });
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, {
      headers: this.headers(),
    });
  }

  getQrCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/qr-code`, {
      headers: this.headers(),
    });
  }

  // Toutes les inscriptions du participant
  getInscriptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inscriptions`, {
      headers: this.headers(),
    });
  }

  // Détail d'une inscription
  getInscription(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/inscriptions/${id}`, {
      headers: this.headers(),
    });
  }

  // Programme d'une conférence
  getProgramme(conferenceId: number): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/conferences/${conferenceId}/programme`, {
      headers: this.headers(),
    });
  }
}