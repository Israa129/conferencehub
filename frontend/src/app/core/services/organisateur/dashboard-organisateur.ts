import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardOrganisateurService {
  private apiUrl = 'http://127.0.0.1:8000/api/organisateur/dashboard-stats';

  constructor(private http: HttpClient) {}

  getStats(organisateurId: number): Observable<any> {
    const params = new HttpParams().set('organisateur_id', organisateurId.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }
}