import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './components/home/home.component';
import { FeaturedProjectsComponent } from './components/featured-projects/featured-projects.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { HighestProjectsComponent } from './components/highest-projects/highest-projects.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { LandingComponent } from './components/landing/landing.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { CommentsComponent } from './components/comments/comments.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'projects',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: ':id', component: ProjectComponent },
      { path: ':id/edit', component: EditProjectComponent },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ProjectComponent,
    LandingComponent,
    FeaturedProjectsComponent,
    CategoryComponent,
    CategoriesComponent,
    ProjectsComponent,
    ProjectCardComponent,
    HighestProjectsComponent,
    ProjectCardComponent,
    ProjectItemComponent,
    NavbarComponent,
    SearchComponent,
    FooterComponent,
    EditProjectComponent,
    SearchResultComponent,
    CommentsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    SearchResultComponent,
    NavbarComponent,
    FooterComponent
  ]
})

export class ProjectModule { }
