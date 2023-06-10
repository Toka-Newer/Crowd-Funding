import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private baseUrl:string=`${environment.API_URL}/api`
  constructor(private http:HttpClient) {}


  getTags():any{
    return this.http.get(`${this.baseUrl}/tags`)
  }
}
