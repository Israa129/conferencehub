import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private baseUrl = 'http://localhost:8000/api/admin/audit-logs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    });
  }

  getLogs(filters: any = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(this.baseUrl, {
      params,
      headers: this.getHeaders()
    });
  }

  getActions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/actions`, {
      headers: this.getHeaders()
    });
  }
}