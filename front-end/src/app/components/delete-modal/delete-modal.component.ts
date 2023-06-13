import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {

  errors: any | undefined;
  form: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      // Validators.pattern(
      //   "^S*(?=S{8,})(?=S*[a-z])(?=S*[A-Z])(?=S*[d])(?=S*[W])S*$"
      // ),
    ]),
  });
  constructor(private userService: UserService, private router: Router) { }

  get getPassword() {
    return this.form.controls['password'];
  }

  deleteProfile(e: Event) {
    e.preventDefault();
    console.log(this.form);
    if (this.form.status == 'VALID') {
      this.userService.deleteProfile(this.getPassword.value).subscribe(
        {
          next: () => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.router.navigate(['/login'])
          },
          error: (err) => {
            console.log(err);
            this.errors = err.error
          }
        }
      )
    }
  }

}
