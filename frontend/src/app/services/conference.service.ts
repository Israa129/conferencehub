import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conference } from '../models/conference';
import { AuthService } from '../core/services/auth';

@Injectable({ providedIn: 'root' })
export class ConferenceService {

  private apiUrl = 'http://127.0.0.1:8000/api/conferences';
  private participantUrl = 'http://127.0.0.1:8000/api/participant';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`,
      Accept: 'application/json',
    });
  }

  getAll(): Observable<Conference[]> {
    return this.http.get<Conference[]>(this.apiUrl);
  }

  getConferences(): Observable<Conference[]> {
    return this.http.get<Conference[]>(this.apiUrl);
  }

  getById(id: number): Observable<Conference> {
    return this.http.get<Conference>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.headers() });
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.headers() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }

  // S'inscrire à une conférence
  sInscrire(conferenceId: number): Observable<any> {
    return this.http.post(
      `${this.participantUrl}/inscriptions`,
      { conference_id: conferenceId },
      { headers: this.headers() }
    );
  }
}