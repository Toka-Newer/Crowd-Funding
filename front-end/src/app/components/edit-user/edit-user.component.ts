import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EditUserService } from 'src/app/services/edit-user.service';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  errors: any;
  myfile:any
  data: FormData = new FormData();
  form: FormGroup = new FormGroup({
    email: new FormControl({value: '', disabled: true}, []),
    username: new FormControl({value: '', disabled: true}, []),
    firstName: new FormControl('', []),
    lastName: new FormControl('', []),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^(011|012|010)([0-9]+){8,11}$'),
    ]),
    image: new FormControl(null, [
      Validators.required,
      // imageValidator(1000000,['jpg','jpeg','png'])
    ]),
      birth_date: new FormControl('',[]),
      facebook_profile: new FormControl('', []),
      counrty: new FormControl('', []),
    });
    
    constructor(private auth: AuthService,private editUser: EditUserService, private router: Router) {}

    ngOnInit() {
      this.editUser.fetchData().subscribe({
        next: (res: any) => {
          console.log(this.data)
          console.log("Response : ",res);
          this.form.patchValue({
            email: res.email,
            username: res.username,
            firstName: res.first_name,
            lastName: res.last_name,
            mobile: res.phone,
            birth_date: res.birth_date,
            counrty: res.counrty,
            facebook_profile: res.facebook_profile,
            // and so on for other form controls
          });
          console.log("Form : ",this.form);

        },
        error: (err) => {
          console.log(this.data)
          console.log(err);
          this.errors = err.error;
        },
      });
      this.form.get('facebook_profile')?.setValidators([
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]/)
      ]);
    }
    

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
  get getBirth_date() {
    return this.form.controls['birth_date'];
  }
  get getFacebook_profile() {
    return this.form.controls['facebook_profile'];
  }
  get getCounrty() {
    return this.form.controls['counrty'];
  }

  readUrl(event:any){
    console.log(event.target.files[0])
    this.myfile =event.target.files[0]
    const file = event.target.files[0]
    const type = file.type
    const validExt = ['image/jpeg','image/jpg','image/png']
    const size = file.size
    if (!validExt.includes(type)){
    return  this.getImage.setErrors({ ...(this.getImage.errors || {}), 'invalidExtension': 'invalid extension' })
    }
    if (size>2000000){
    return  this.getImage.setErrors({ ...(this.getImage.errors || {}), 'maxSize': 'max size exceeds 2 mb' })
    }
    return this.getImage.setErrors(null)
  }

  submit(e: Event) {
    e.preventDefault();
    if (this.form.status == 'VALID') {
      console.log(this.getImage.value)
      console.log(this.getUserName.value)
      this.data.append('birth_date', this.getBirth_date.value);
      this.data.append('facebook_profile', this.getFacebook_profile.value);
      this.data.append('counrty', this.getCounrty.value);
      this.data.append('phone', this.getMobile.value);
      this.data.append('picture', this.myfile);
      this.data.append('first_name', this.getFirstName.value);
      this.data.append('last_name', this.getLastName.value);

      console.log(this.data)

      this.editUser.editData(this.data).subscribe({
        next: (res: any) => {
          console.log(this.data)
          console.log(res);
          this.router.navigate(['/user/details']);
        },
        error: (err) => {
          console.log(this.data)
          console.log(err);
          this.errors = err.error;
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
