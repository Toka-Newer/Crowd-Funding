import { ProjectService } from 'src/app/services/project.service';

import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, Directive } from '@angular/core';


@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css'],
  encapsulation: ViewEncapsulation.Emulated

})

export class RateComponent implements OnInit {

  @Input() id: any
  @Input() userRate: any = null

  @Input() avg_rate: any = null
  max = 5;
  rate = 0;
  @Input() isReadonly: boolean = false;

  constructor(private projectService: ProjectService) {
  }
  ngOnInit(): void {
    if (this.userRate) {
      this.rate = this.userRate.rate
    }
    if (this.avg_rate) {
      this.rate = this.avg_rate
    }
  }

  rateProject() {
    if (!this.userRate) {
      this.projectService.rate(Number(this.id), this.rate).subscribe(
        {
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          }
        }
      )
    } else {
      this.projectService.rateUpdate(Number(this.userRate.id), Number(this.id), this.rate).subscribe(
        {
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          }
        }
      )
    }


  }


}
