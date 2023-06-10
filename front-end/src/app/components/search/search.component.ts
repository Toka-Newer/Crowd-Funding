import { Component } from '@angular/core';
import { ProjectService } from './../../services/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent {
  constructor(private projectService: ProjectService, private searchService: SearchService) { }
  projects: any;
  placeholder: any = "Search in projects by name or tag";
  errors: any
  flag: boolean = false
  back_end_url: any = environment.API_URL

  // ngOnInit(): void {
  //   this.projects = this.projectService.getData()
  //   console.log(this.projects)
  // }

  myform: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required]),
  });

  get getSearchValue() {
    return this.myform.controls['value'];
  }
  submit(e: Event) {
    e.preventDefault();
    if (this.myform.status == 'VALID') {
      console.log("sdadas", this.getSearchValue.value)
      this.searchService.search(this.getSearchValue.value).subscribe({
        next: (res: any) => {
          this.projects = res
          this.flag = true
          console.log(res);
        },
        error: (err) => {
          console.log(err);
          this.errors = err.error;
        },
      });
    } else {
      this.placeholder = 'type project name or tag'
      this.myform.markAllAsTouched();
    }
  }

  // getDaysLeft(end: any, start: any) {
  //   return Math.floor((new Date(end).getTime() - new Date(start).getTime()));

  // }

  transformDuration(end: any, start: any) {
    const duration = Math.floor((new Date(end).getTime() - new Date(start).getTime()));
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day(s)`;
    } else if (hours > 0) {
      return `${hours} hour(s)`;
    } else if (minutes > 0) {
      return `${minutes} minute(s)`;
    } else {
      return `${seconds} second(s)`;
    }
  }

  transformWords(value:string,slice:number){
    if (!value) {
      return '';
    }

    const words = value.split(' ');
    const limitedWords = words.slice(0, slice);
    return limitedWords.join(' ');
  }
  percentComplete(project:any){
    return parseFloat(((project.current_donations / project.target_donations) * 100).toFixed(3))
  }
}
