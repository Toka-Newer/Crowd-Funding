import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errors: any | undefined;
  form: FormGroup = new FormGroup({
    UserName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      // Validators.pattern(
      //   "^S*(?=S{8,})(?=S*[a-z])(?=S*[A-Z])(?=S*[d])(?=S*[W])S*$"
      // ),
    ]),
  });
  constructor(private auth: AuthService, private router: Router) {}

  get getUserName() {
    return this.form.controls['UserName'];
  }

  get getPassword() {
    return this.form.controls['password'];
  }

  get isLoggedIn() {
    return this.auth;
  }

  submit(e: Event) {
    e.preventDefault();
    if (this.form.status == 'VALID') {
      this.auth
        .login({
          username: this.getUserName.value,
          password: this.getPassword.value,
        })
        .subscribe({
          next: (res: any) => {
            this.auth.loggedUser = res.user;
            localStorage.setItem('user',JSON.stringify( this.auth.loggedUser))
            this.router.navigate(['/projects']);
            localStorage.setItem('token', res.token);
          },
          error: (err) => {
            this.errors = err.error.errors;
            console.log(this.errors);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
  private redirect(role: string | undefined) {
    if (role == 'admin') {
      this.router.navigate(['admin-dashboard']);
    } else if (role == 'user') {
      this.router.navigate(['jobs']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
