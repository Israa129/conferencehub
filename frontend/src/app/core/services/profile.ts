import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });
  }

  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/profile`,
      { headers: this.headers() });
  }

  updateProfile(data: any) {
    return this.http.put<any>(`${this.baseUrl}/profile`,
      data, { headers: this.headers() });
  }

  updatePassword(data: any) {
    return this.http.put<any>(`${this.baseUrl}/profile/password`,
      data, { headers: this.headers() });
  }
}