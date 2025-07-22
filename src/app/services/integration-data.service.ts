import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IntegrationDataService {
  private apiUrl = 'http://localhost:3000/users';
  private httpClient = inject(HttpClient);

  getData(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(this.apiUrl, data);
  }

  update(data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${data.id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
