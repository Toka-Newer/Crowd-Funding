import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-featured-projects',
  templateUrl: './featured-projects.component.html',
  styleUrls: ['./featured-projects.component.css']
})
export class FeaturedProjectsComponent implements OnInit {

  @Input() projects:any=[]
  ngOnInit(): void {
    console.log(this.projects);
  }
}
