import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {
  userId:any;
  projects:any;
  constructor(
    private ActivatedRoute:ActivatedRoute,
    private userservice:UserService,){
      this.userId=Number(this.ActivatedRoute.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {
    this.userservice.getUserProjects(this.userId).subscribe({
      next:(response:any)=>{console.log(response);this.projects=response
      this.projects.picture=environment.API_URL.concat(this.projects.picture)
      },

    });
  }
}
