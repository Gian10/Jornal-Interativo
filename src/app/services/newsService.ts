import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = 'https://wsobcols5f.execute-api.us-east-1.amazonaws.com/dev/news';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getNews(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.headers });
  }

  postNews(news: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, news, { headers: this.headers });
  }
}
