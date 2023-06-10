import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-highest-projects',
  templateUrl: './highest-projects.component.html',
  styleUrls: ['./highest-projects.component.css']
})
export class HighestProjectsComponent  {

  @Input() projects:any=[]



}
