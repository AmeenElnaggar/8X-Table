import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IColumnDefinition } from '../../shared/interfaces/column-definition.model';

@Injectable({ providedIn: 'root' })
export class BackendService {
  private httpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getMetadata(endpoint: string): Observable<IColumnDefinition[]> {
    return this.httpClient.get<IColumnDefinition[]>(
      `${this.apiUrl}/${endpoint}`
    );
  }

  getData(endpoint: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/${endpoint}`);
  }

  create(endpoint: string, data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }

  update(endpoint: string, data: any): Observable<any> {
    return this.httpClient.put<any>(
      `${this.apiUrl}/${endpoint}/${data.id}`,
      data
    );
  }

  delete(endpoint: string, id: any): Observable<any> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${endpoint}/${id}`);
  }
}
