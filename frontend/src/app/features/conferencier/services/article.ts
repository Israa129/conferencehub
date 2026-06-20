import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStateService } from '../../../core/services/user-state';

export interface Article {
  _id: string;
  titre: string;
  resume: string;
  mots_cles: string[];
  fichier_pdf: string;
  statut: 'en_revision' | 'accepte' | 'refuse';
  commentaires?: string;
  conference_id: string;
  conference_nom: string;
  conference_lieu: string;
  conferencier_id: string;
  conferencier_nom: string;
  session_assignee?: string;
  date_presentation?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleStats {
  total: number;
  en_revision: number;
  accepte: number;
  refuse: number;
  par_conference: Record<string, number>;
}

export interface ArticlesResponse {
  success: boolean;
  data: Article[];
  stats: ArticleStats;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private api = 'http://127.0.0.1:8000/api/conferencier';

  constructor(private http: HttpClient, private userState: UserStateService) {}

  private authHeaders(): HttpHeaders {
    const u = this.userState.user();
    const userId = (u as any)?.id ?? '';
    const userName = u ? `${(u as any).prenom ?? ''} ${(u as any).nom ?? ''}`.trim() : '';
    return new HttpHeaders({
      'X-User-Id': String(userId),
      'X-User-Name': userName,
    });
  }

  getArticles(statut?: string): Observable<ArticlesResponse> {
    let params = new HttpParams();
    if (statut && statut !== 'tous') params = params.set('statut', statut);
    return this.http.get<ArticlesResponse>(`${this.api}/articles`, { params, headers: this.authHeaders() });
  }

  getArticle(id: string): Observable<{ success: boolean; data: Article }> {
    return this.http.get<{ success: boolean; data: Article }>(`${this.api}/articles/${id}`, { headers: this.authHeaders() });
  }

  getStats(): Observable<{ success: boolean; data: ArticleStats }> {
    return this.http.get<{ success: boolean; data: ArticleStats }>(`${this.api}/stats`, { headers: this.authHeaders() });
  }

  soumettre(formData: FormData): Observable<{ success: boolean; message: string; data: Article }> {
    return this.http.post<{ success: boolean; message: string; data: Article }>(`${this.api}/articles`, formData, { headers: this.authHeaders() });
  }

  modifier(id: string, formData: FormData): Observable<{ success: boolean; message: string; data: Article }> {
    return this.http.post<{ success: boolean; message: string; data: Article }>(`${this.api}/articles/${id}`, formData, { headers: this.authHeaders() });
  }

  supprimer(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.api}/articles/${id}`, { headers: this.authHeaders() });
  }

  telechargerPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.api}/articles/${id}/download`, { responseType: 'blob', headers: this.authHeaders() });
  }

  changerStatut(id: string, statut: 'en_revision' | 'accepte' | 'refuse', commentaires?: string): Observable<{ success: boolean; message: string; data: Article }> {
    return this.http.post<{ success: boolean; message: string; data: Article }>(
      `${this.api}/articles/${id}/statut`, 
      { statut, commentaires }
    );
  }
  getArticlesByOrganisateur(statut?: string, conferenceId?: number): Observable<ArticlesResponse> {
    let params = new HttpParams();
    if (statut && statut !== 'tous') params = params.set('statut', statut);
    if (conferenceId) params = params.set('conference_id', conferenceId);
    
    return this.http.get<ArticlesResponse>(`${this.api}/articles-organisateur`, { params });
  }
}