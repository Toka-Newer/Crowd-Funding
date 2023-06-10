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
  private  id:Number=Number(this.activatedRoute.snapshot.paramMap.get('id'));

  back_end_url: any = environment.API_URL
  constructor(private projectService:ProjectService,private activatedRoute: ActivatedRoute){}
  

  data:any=null
  project:any=null
  similarProjects:any
  progress:any
  urls:String[]=[]
  loggedUser:any
  validDonation:boolean=false
  form: FormGroup = new FormGroup({
    amount: new FormControl(5, [Validators.required, Validators.pattern('[0-9]+')])
  })
  ngOnInit():void {
    this.projectService.getProjectById(this.id).subscribe(
      {
        next:(res)=>{
          this.data=res
          this.project=this.data.project
          this.similarProjects=this.data.similar_projects
          console.log(this.project);
          // for(let i=0;i<this.project.images.length;i++){
          //   this.project.images[i].url=environment.API_URL.concat(this.project.images[i].url)
        // }
        this.loggedUser=localStorage.getItem('user')
        },
        error:(err)=>{
          console.log(err);
        }
      }
    )

  }
  donate(){

  }
  get getAmount(){
    return this.form.controls['amount']
  }
  submit(e:any){
    e.preventDefault();
    if (this.form.status == 'VALID') {
      console.log({project:this.project.id,amount:this.getAmount.value});
this.projectService.donate({project:this.project.id,amount:this.getAmount.value}).subscribe({
  next:(res)=>{
    this.validDonation=true
    console.log(res);
  },
  error:(err)=>{
    console.log(err);

  }
})
    }
  }

  }

