import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'http://127.0.0.1:8000/api/admin';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  getStats() {
    return this.http.get<any>(`${this.baseUrl}/stats`, { headers: this.headers() });
  }

  getUtilisateurs(params: any = {}) {
    return this.http.get<any>(`${this.baseUrl}/utilisateurs`, {
      headers: this.headers(),
      params
    });
  }

  updateRole(id: number, role: string) {
    return this.http.put(`${this.baseUrl}/utilisateurs/${id}/role`, { role }, { headers: this.headers() });
  }

  toggleStatut(id: number) {
    return this.http.put(`${this.baseUrl}/utilisateurs/${id}/statut`, {}, { headers: this.headers() });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/utilisateurs/${id}`, { headers: this.headers() });
  }
}