import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Conference } from '../models/conference';

@Injectable({
  providedIn: 'root'
})

export class ConferenceService {

  private apiUrl = 'http://127.0.0.1:8000/api/conferences';

  constructor(private http: HttpClient) {}

  getConferences(): Observable<Conference[]> {

    return this.http.get<Conference[]>(this.apiUrl);

  }

}