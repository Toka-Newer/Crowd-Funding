import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent {

  errors: any;
  code: string;
  email: string;
  constructor(private auth: AuthService, private router: Router,private activatedRoute: ActivatedRoute,) {
    this.code = String(this.activatedRoute.snapshot.paramMap.get('code'));
    this.email = String(this.activatedRoute.snapshot.paramMap.get('email'));
  }

  submit() {
        this.auth.confirm(this.email,this.code).subscribe({
      next: (res: any) => {
        // console.log(this.data)
        console.log("Response : ",res);
        this.auth.loggedUser = res.user;
        localStorage.setItem('user',this.auth.loggedUser)
        this.router.navigate(['/home']);
        localStorage.setItem('token', res.token);
        
      },
      error: (err) => {
        // console.log(this.data)
        console.log(err);
        this.errors = err.error;
      },
    });
  }
}
