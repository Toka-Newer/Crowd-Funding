import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from './../../services/project.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  back_end_url: any = environment.API_URL
  constructor(private projectService: ProjectService) { }
  @Input() project: any = {}
  // ngOnInit(): void {
  //   // console.log(this.projects);
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

  transformWords(value: string, slice: number) {
    if (!value) {
      return '';
    }

    const words = value.split(' ');
    const limitedWords = words.slice(0, slice);
    return limitedWords.join(' ');
  }
  percentComplete(project: any) {
    return parseFloat(((project?.current_donations / project?.target_donations) * 100).toFixed(3))
  }

}
