import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getArticles(statut?: string): Observable<ArticlesResponse> {
    let params = new HttpParams();
    if (statut && statut !== 'tous') params = params.set('statut', statut);
    return this.http.get<ArticlesResponse>(`${this.api}/articles`, { params });
  }

  getArticle(id: string): Observable<{ success: boolean; data: Article }> {
    return this.http.get<{ success: boolean; data: Article }>(`${this.api}/articles/${id}`);
  }

  getStats(): Observable<{ success: boolean; data: ArticleStats }> {
    return this.http.get<{ success: boolean; data: ArticleStats }>(`${this.api}/stats`);
  }

  soumettre(formData: FormData): Observable<{ success: boolean; message: string; data: Article }> {
    return this.http.post<{ success: boolean; message: string; data: Article }>(`${this.api}/articles`, formData);
  }

  modifier(id: string, formData: FormData): Observable<{ success: boolean; message: string; data: Article }> {
    return this.http.post<{ success: boolean; message: string; data: Article }>(`${this.api}/articles/${id}`, formData);
  }

  supprimer(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.api}/articles/${id}`);
  }

  telechargerPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.api}/articles/${id}/download`, { responseType: 'blob' });
  }

  changerStatut(id: string, statut: 'en_revision' | 'accepte' | 'refuse', commentaires?: string): Observable<{ success: boolean; message: string; data: Article }> {
    return this.http.post<{ success: boolean; message: string; data: Article }>(
      `${this.api}/articles/${id}/statut`, 
      { statut, commentaires }
    );
  }
}