import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardOrganisateurService {
  private apiUrl = 'http://127.0.0.1:8000/api/dashboard/stats';

  constructor(private http: HttpClient) {}

  getStats(organisateurId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${organisateurId}`);
  }
}