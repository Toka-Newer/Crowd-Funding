import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl:string=`${environment.API_URL}/api`
  constructor(private http:HttpClient) {}
  search(value:any){
    return this.http.get(`${this.baseUrl}/search?value=${value}`)
  }
  
}
