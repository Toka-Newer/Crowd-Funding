import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errors: any;
  myfile: any
  data: FormData = new FormData();
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^(011|012|010)([0-9]+){8}$'),
    ]),
    image: new FormControl(null, [
      Validators.required,
      // imageValidator(1000000,['jpg','jpeg','png'])
    ]),
    password: new FormControl('', [
      Validators.required,
      // Validators.pattern(
      //   "^S*(?=S{8,})(?=S*[a-z])(?=S*[A-Z])(?=S*[d])(?=S*[W])S*$"
      // ),
    ]),
    password2: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthService, private router: Router) { }

  get getEmail() {
    return this.form.controls['email'];
  }

  get getPassword() {
    return this.form.controls['password'];
  }

  get isLoggedIn() {
    return this.auth;
  }
  get getUserName() {
    return this.form.controls['username'];
  }

  get getAddress() {
    return this.form.controls['address'];
  }

  get getMobile() {
    return this.form.controls['mobile'];
  }
  get getFirstName() {
    return this.form.controls['firstName'];
  }
  get getLastName() {
    return this.form.controls['lastName'];
  }
  get getImage() {
    return this.form.controls['image'];
  }
  get getPassword2() {
    return this.form.controls['password2'];
  }

  readUrl(event: any) {
    console.log(event.target.files[0])
    this.myfile = event.target.files[0]
    const file = event.target.files[0]
    const type = file.type
    const validExt = ['image/jpeg', 'image/jpg', 'image/png']
    const size = file.size
    if (!validExt.includes(type)) {
      return this.getImage.setErrors({ ...(this.getImage.errors || {}), 'invalidExtension': 'invalid extension' })
    }
    if (size > 2000000) {
      return this.getImage.setErrors({ ...(this.getImage.errors || {}), 'maxSize': 'max size exceeds 2 mb' })
    }
    return this.getImage.setErrors(null)
  }

  submit(e: Event) {
    let code: number = 0;
    let email: string = this.getEmail.value;
    e.preventDefault();
    if (this.form.status == 'VALID') {
      this.data.append('username', this.getUserName.value);
      this.data.append('first_name', this.getFirstName.value);
      this.data.append('last_name', this.getLastName.value);
      this.data.append('email', this.getEmail.value);
      this.data.append('password', this.getPassword.value);
      this.data.append('password2', this.getPassword2.value);
      this.data.append('phone', this.getMobile.value);
      this.data.append('picture', this.myfile);
      this.auth.register(this.data).subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigate([`/verifiy-email/${email}/${code}`]);
        },
        error: (err) => {
          console.log(err);
          this.errors = err.error;
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
