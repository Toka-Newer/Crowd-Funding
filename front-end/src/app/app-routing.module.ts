import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { CustomRouteReuseStrategy } from './components/project/custom-route-reuse-strategy'

const routes: Routes = [
  { path: 'home', component:HomeComponent  },
  {path : 'register', component:RegisterComponent},
  {path : 'verifiy-email/:email/:code', component:EmailConfirmationComponent},
  {path:'login',component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
})
export class AppRoutingModule { }
