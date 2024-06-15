import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PartsComponent } from './parts/parts.component';
import { UsersComponent } from './users/users.component';
import { ServiceComponent } from './service/service.component';
import { ClientPanelComponent } from './client-panel/client-panel.component';
import { CarServiceComponent } from "./car-service/car-service.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'parts', component: PartsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UsersComponent},
  {path: 'service', component: ServiceComponent},
  {path: 'client', component: ClientPanelComponent},
  {path: 'car-service', component: CarServiceComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
