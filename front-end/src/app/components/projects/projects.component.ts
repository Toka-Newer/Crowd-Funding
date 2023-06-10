import { ProjectService } from './../../services/project.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects:any=[]
  constructor (private projectService:ProjectService){}
  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(
      {
        next:(res)=>{
          this.projects=res
          this.projectService.setData(res);
        }
      }
    )

  }

}
