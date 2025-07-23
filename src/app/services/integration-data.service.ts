import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColumnDefinition } from '../interfaces/column.model';

@Injectable({ providedIn: 'root' })
export class IntegrationDataService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getMetadata(): Observable<any[]> {
    return this.httpClient.get<ColumnDefinition[]>(`${this.apiUrl}/metadata`);
  }

  getData(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/data`);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/data`, data);
  }

  update(data: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/data/${data.id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete<void>(`${this.apiUrl}/data/${id}`);
  }
}
