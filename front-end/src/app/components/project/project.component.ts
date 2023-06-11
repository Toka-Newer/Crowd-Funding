import { ActivatedRoute } from '@angular/router';
import { ProjectService } from './../../services/project.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private id: Number = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  back_end_url: any = environment.API_URL
  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute) { }


  data: any = null
  project: any = null
  similarProjects: any
  progress: any
  urls: String[] = []
  loggedUser: any
  validDonation: boolean = false
  targetDonations: any
  userRate: any;
  form: FormGroup = new FormGroup({
    amount: new FormControl(5, [Validators.required, Validators.pattern('[0-9]+')])
  })
  ngOnInit(): void {
    this.projectService.getProjectById(this.id).subscribe(
      {
        next: (res) => {
          this.loggedUser = localStorage.getItem('user')
          this.loggedUser = JSON.parse(this.loggedUser)
          this.data = res
          this.project = this.data.project
          this.similarProjects = this.data.similar_projects
          this.targetDonations = 0.25 * this.project.target_donations
          this.userRate = this.data?.project?.ratings?.filter((element: any) => {
            return element.user === this.loggedUser.id
          })[0];
          console.log(this.userRate);
        },
        error: (err) => {
          console.log(err);
        }
      }
    )
  }
  donate() {

  }
  get getAmount() {
    return this.form.controls['amount']
  }
  submit(e: any) {
    e.preventDefault();
    if (this.form.status == 'VALID') {
      console.log({ project: this.project.id, amount: this.getAmount.value });
      this.projectService.donate({ project: this.project.id, amount: this.getAmount.value }).subscribe({
        next: (res) => {
          this.validDonation = true
          console.log(res);
        },
        error: (err) => {
          console.log(err);

        }
      })
    }
  }

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

  percentComplete(project: any) {
    return parseFloat(((project.current_donations / project.target_donations) * 100).toFixed(3))
  }

}

