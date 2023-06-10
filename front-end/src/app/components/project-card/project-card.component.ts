import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project:any
  ngOnInit(): void {
    for( let i=0;i<this.project.images.length;i++){
     this.project.images[i].url=environment.API_URL.concat(this.project.images[i].url)
    }
     }
}
