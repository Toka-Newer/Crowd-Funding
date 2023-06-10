import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent implements OnInit {
  id: number = 0;
  MyData: any | null = null;
  constructor(private active: ActivatedRoute, private service: ProfileService) {
    this.id = Number(this.active.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {
    this.service.getUserDetails(this.id).subscribe({
      next: (response) => {
        console.log(response);
        this.MyData = response
        this.MyData.picture = environment.API_URL.concat(this.MyData.picture)
      },
    })
  }
}
