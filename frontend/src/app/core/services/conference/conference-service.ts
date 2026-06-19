import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conference } from '../../models/Conference';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  private baseUrl = 'http://localhost:8000/api/conferences';
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<Conference[]> {
    return this.http.get<Conference[]>(this.baseUrl);
  }
 
  getById(id: number): Observable<Conference> {
    return this.http.get<Conference>(`${this.baseUrl}/${id}`);
  }
 
  create(data: Conference): Observable<Conference> {
    return this.http.post<Conference>(this.baseUrl, data);
  }
 
  update(id: number, data: Conference): Observable<Conference> {
    return this.http.put<Conference>(`${this.baseUrl}/${id}`, data);
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
 
  search(q: string): Observable<Conference[]> {
    return this.http.get<Conference[]>(`${this.baseUrl}?search=${encodeURIComponent(q)}`);
  }

  getByOrganisateur(organisateurId: number): Observable<Conference[]> {
    return this.http.get<Conference[]>(`${this.baseUrl}/organisateur/${organisateurId}`);
  }
}
