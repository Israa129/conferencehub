import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SessionConference } from '../../models/SessionConference';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private baseUrl = 'http://localhost:8000/api/sessions';
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<SessionConference[]> {
    return this.http.get<SessionConference[]>(this.baseUrl);
  }
 
  getById(id: number): Observable<SessionConference> {
    return this.http.get<SessionConference>(`${this.baseUrl}/${id}`);
  }
 
  getByConference(conferenceId: number): Observable<SessionConference[]> {
    return this.http.get<SessionConference[]>(`${this.baseUrl}?conferenceId=${conferenceId}`);
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
}
