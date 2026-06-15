import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs';
import { SessionConference } from '../../models/SessionConference';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private baseUrl = 'http://localhost:8000/api/sessions';
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<SessionConference[]> {
    return this.http
      .get<SessionConference[]>(this.baseUrl)
      .pipe(map((sessions) => sessions.map((session) => this.normalize(session))));
  }
 
  getById(id: number): Observable<SessionConference> {
    return this.http
      .get<SessionConference>(`${this.baseUrl}/${id}`)
      .pipe(map((session) => this.normalize(session)));
  }
 
  getByConference(conferenceId: number): Observable<SessionConference[]> {
    return this.http
      .get<SessionConference[]>(`${this.baseUrl}?conference_id=${conferenceId}&conferenceId=${conferenceId}`)
      .pipe(map((sessions) => sessions.map((session) => this.normalize(session))));
  }
 
  create(data: SessionConference): Observable<SessionConference> {
    return this.http.post<SessionConference>(this.baseUrl, data);
  }
 
  update(id: number, data: SessionConference): Observable<SessionConference> {
    return this.http.put<SessionConference>(`${this.baseUrl}/${id}`, data);
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private normalize(session: any): SessionConference {
    return {
      ...session,
      horaireDebut: session.horaireDebut ?? session.horaire_debut,
      horaireFin: session.horaireFin ?? session.horaire_fin,
      conferenceId: session.conferenceId ?? session.conference_id,
    };
  }
}
