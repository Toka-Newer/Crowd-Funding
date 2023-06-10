import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { TagsService } from 'src/app/services/tags.service';
import { CategoryService } from 'src/app/services/category.service';
import { dateRangeValidator } from './date-range-validator';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})

export class EditProjectComponent {
  errors: any;
  myfiles: any = [];
  categories: any;
  tags: any;
  imagesError: any = {}
  form: FormGroup=new FormGroup({});
  data: FormData = new FormData();
  constructor(
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private tagsService: TagsService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      details: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
      target_donations: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required,]),
      end_date: new FormControl('', [Validators.required,]),
      images: new FormControl(null, [Validators.required,])
    }, { validators: dateRangeValidator() });


    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        console.log(res)
        this.categories = res

      }
    })

    this.tagsService.getTags().subscribe({
      next: (res: any) => {

        this.tags = res
        console.log(res)
      }
    })

  }





  get getTitle() {
    return this.form.controls['title'];
  }
  get getCategory() {
    return this.form.controls['category'];
  }
  get getDetails() {
    return this.form.controls['details'];
  }

  get getTags() {
    return this.form.controls['tags'];
  }

  get getTargetDonations() {
    return this.form.controls['target_donations'];
  }

  get getStartDate() {
    return this.form.controls['start_date'];
  }
  get getEndDate() {
    return this.form.controls['end_date'];
  }

  get getImages() {
    return this.form.controls['images'];
  }


  readUrl(event: any) {
    this.myfiles = event.target.files
    const validExt = ['image/jpeg', 'image/jpg', 'image/png']

    for (const key in this.myfiles) {
      if (!validExt.includes(this.myfiles[key].type)) {
        return this.getImages.setErrors({ ...(this.getImages.errors || {}), 'invalidExtension': `${this.myfiles[key].name} invalid extension` })
      }
      if (this.myfiles[key].size > 2000000) {
        return this.getImages.setErrors({ ...(this.getImages.errors || {}), 'maxSize': `${this.myfiles[key].name} max size exceeds 2 mb` })
      }

      return this.getImages.setErrors(null)
    }

  }

  submit(e: Event) {
    e.preventDefault();
    if (this.form.status == 'VALID') {
      this.data.append('title', this.getTitle.value);
      this.data.append('category', this.getCategory.value);
      this.data.append('details', this.getDetails.value);
      this.data.append('target_donations', this.getTargetDonations.value);
      this.data.append('start_date', this.getStartDate.value);
      this.data.append('end_date', this.getEndDate.value);
      
      
      for (let index = 0; index < this.getTags.value.length; index++) {
        this.data.append('tags', this.getTags.value[index]);
        
      }
      for (let index = 0; index < this.myfiles.length; index++){
        console.log("set file",this.myfiles[index])
        this.data.append('images', this.myfiles[index]);
      }
      this.projectService.addProject(this.data).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.router.navigate(['/user/projects'])
        },
        error: (err) => {
          console.log(err);
          this.errors = err.error;
        },
      });
    } else {
      console.log(this.form.errors)

      this.form.markAllAsTouched();
    }
  }


}



