import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl: string = `${environment.API_URL}/api`
  constructor(private http: HttpClient) { }
  addComment(value: any) {
    return this.http.post(`${this.baseUrl}/comments`, value)
  }
  reportComment(value: any) {
    return this.http.post(`${this.baseUrl}/reports`, value)
  }

}
