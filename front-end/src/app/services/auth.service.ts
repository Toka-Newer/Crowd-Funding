import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedUser: any;
  private baseUrl: string = `${environment.API_URL}/auth`;

  constructor(private http: HttpClient , private router:Router ) { }
  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
  register(credentials: any) {
    console.log('credentials:', credentials)
    return this.http.post(`${this.baseUrl}/register`,credentials);
  }
  logout() {
    this.loggedUser = undefined;
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.router.navigate(['/login'])
  }

  get getLoggedUser(){
    const user:String|any=localStorage.getItem("user")
    return JSON.parse(JSON.parse(user))
  }

  get getToken() {
    return localStorage.getItem('token');
  }
  confirm(email: any,code: any) {
    console.log('email:', email, 'code: ',code)
    // http://localhost:8000/auth/verifiy-email/mohammed1997amr@gmail.com/5o8IzVdIq9gfLwkN
    return this.http.post(`${this.baseUrl}/verifiy-email/${email}/${code}`,{});
  }
}
