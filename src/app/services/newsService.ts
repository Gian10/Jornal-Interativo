import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fetchAuthSession } from '@aws-amplify/auth';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl = 'https://bk5j0zsy1k.execute-api.us-east-1.amazonaws.com/master';

  constructor(private http: HttpClient) {}

  getNews(): Observable<any> {
    return from(fetchAuthSession()).pipe(
      switchMap((session: any) => {
        const token = session.tokens?.idToken?.toString();
        //console.log('Token Cognito:', token);
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token || ''
        });
        return this.http.get<any>(`${this.apiUrl}/news`, { headers });
      })
    );
  } 

  postNews(news: any): Observable<any> {
    return from(fetchAuthSession()).pipe(
      switchMap((session: any) => {
        const token = session.tokens?.idToken?.toString();
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token || ''
        });
        return this.http.post<any>(`${this.apiUrl}/news`, news, { headers });
      })
    );
  }

 
  addComentario(uuid: string, comentario: { texto: string, data: string }): Observable<any> {
    return from(fetchAuthSession()).pipe(
      switchMap((session: any) => {
        const token = session.tokens?.idToken?.toString();
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token || ''
        });
        return this.http.put<any>(`${this.apiUrl}/news/${uuid}/comentarios`, { comentarios: [comentario] }, { headers });
      })
    );
  }
}
