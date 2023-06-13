import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const headers = new HttpHeaders().set('Authorization', 'token 52c1e81a8cb4090afafd365f668ab10b5e9e4fe5');
@Injectable({
  providedIn: 'root',
})
export class EditUserService {
  private baseUrl: string = `${environment.API_URL}/api`;
  constructor(private http: HttpClient) { }

  fetchData() {
    const url = `${this.baseUrl}/profile`;
    // console.log(this.http.get(url , { headers }));
    return this.http.get(url, { headers });
  }

  editData(data: any) {
    const url = `${this.baseUrl}/profile`;
    // console.log(this.http.get(url , { headers }));
    return this.http.put(url, data, { headers });
  }

}

