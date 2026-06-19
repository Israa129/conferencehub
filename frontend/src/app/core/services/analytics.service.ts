import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = 'http://127.0.0.1:8000/api/admin/analytics';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAnalytics(jours: number = 7) {
    return this.http.get<any>(`${this.base}?jours=${jours}`, { headers: this.headers() });
  }
}