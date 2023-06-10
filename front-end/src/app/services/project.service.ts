import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl:string=`${environment.API_URL}/api`
  private projects: any;
  constructor(private http:HttpClient) {}
  getAllProjects(){
    return this.http.get(`${this.baseUrl}/home`)
  }

  setData(data: any) {
    this.projects = data;
  }

  getData(): any {
    return this.projects;
  }
  headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

  getProjectById(ProjectId:Number){
    return this.http.get(`${this.baseUrl}/projects/${ProjectId}`)
  }
  addProject(Project:any){
    console.log(Project)
    return this.http.post(`${this.baseUrl}/projects`,Project)
  }
  editProject(id:any,Project:any){
    return this.http.put(`${this.baseUrl}/${id}`,Project)
  }
  deleteProject(id:any){
    return this.http.delete(`${this.baseUrl}/${id}`)
  }
  donate(donation:any){
    return this.http.post(`${this.baseUrl}/donations`,donation)
  }
  // rate(id:any){
  //   return this.http
  // }
}
