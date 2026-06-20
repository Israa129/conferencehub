import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private base = 'http://127.0.0.1:8000/api/settings';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getSettings() {
    return this.http.get<any>(this.base, { headers: this.headers() });
  }

  updatePassword(data: { current_password: string; password: string; password_confirmation: string }) {
    return this.http.put<any>(`${this.base}/password`, data, { headers: this.headers() });
  }

  updateNotifications(data: any) {
    return this.http.put<any>(`${this.base}/notifications`, data, { headers: this.headers() });
  }

  updateDisplay(data: any) {
    return this.http.put<any>(`${this.base}/display`, data, { headers: this.headers() });
  }

  updatePrivacy(data: any) {
    return this.http.put<any>(`${this.base}/privacy`, data, { headers: this.headers() });
  }

  deleteAccount(password: string) {
    return this.http.delete<any>(`${this.base}/account`, {
      headers: this.headers(),
      body: { password }
    });
  }
}