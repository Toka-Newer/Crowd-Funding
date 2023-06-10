import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedUser: any
  back_end_url: any = environment.API_URL
  constructor(private authService: AuthService) {

  }
  ngOnInit(): void {
    const user: any = localStorage.getItem('user')
    this.loggedUser = JSON.parse(user)
  }
  get getImageUrl() {
    return this.loggedUser.picture
  }
  logout() {
    this.authService.logout()
  }

}
