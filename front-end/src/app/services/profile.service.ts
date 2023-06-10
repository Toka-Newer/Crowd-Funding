import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
   baseUrl: string = `${environment.API_URL}/api`;
  token: any = localStorage.getItem('token');
  constructor(private http:HttpClient ,  private router: Router) { }
  // headers = new HttpHeaders()
  //   .set('Accept', 'application/json')
  //   .set('Access-Control-Allow-Origin', '*')
  //   .set('Authorization', `Bearer ${this.token}`);
    getUserDetails(id:number){
      return this.http.get(`${this.baseUrl}/profile`);
    }
}
