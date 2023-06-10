import { environment } from './../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent {
  back_end_url: any = environment.API_URL
  @Input() project:any=null
//   ngOnInit(): void {
//  for( let i=0;i<this.project.images.length;i++){
//   this.project.images[i].url=environment.API_URL.concat(this.project.images[i].url)
//  }
//   }

}
