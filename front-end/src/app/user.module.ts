import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationsComponent } from './components/donations/donations.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserProjectsComponent } from './components/user-projects/user-projects.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectModule } from './project.module';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {
    path: 'user',
    canActivate: [AuthGuard],
    children: [
      { path: 'details', component: UserDetailsComponent },
      { path: 'donations', component: DonationsComponent },
      { path: 'projects', component: UserProjectsComponent },
      { path: 'edit', component: EditUserComponent },
    ],
  },
];

@NgModule({
  declarations: [
    DonationsComponent,
    UserDetailsComponent,
    UserProjectsComponent,
    EditUserComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    ProjectModule

  ]
})
export class UserModule { }
