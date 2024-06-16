import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './_interceptors/http.interceptor';
import { PartsComponent } from './parts/parts.component';
import { NavComponent } from './nav/nav.component';
import { UsersComponent } from './users/users.component';
import { RolePipe } from './pipes/role.pipe';
import { ServiceComponent } from './service/service.component';
import { ClientPanelComponent } from './client-panel/client-panel.component';
import { CarServiceComponent } from './car-service/car-service.component';
import { ComplaintPanelComponent } from './complaint-panel/complaint-panel.component';

// Deklaracje komponentów głównych
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PartsComponent,
    NavComponent,
    UsersComponent,
    RolePipe,
    ServiceComponent,
    ClientPanelComponent,
    CarServiceComponent,
    ComplaintPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
