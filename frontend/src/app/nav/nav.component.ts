import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.isAdmin = storageService.hasRole("ADMIN");
    this.isService = storageService.hasRole("SERVICE")
    this.isWareHouse = storageService.hasRole("WAREHOUSE")
  }

  isAdmin: boolean = false;
  isService: boolean = false;
  isWareHouse: boolean = false;

  ngOnInit() {}

  logout() {
    this.loginService.logout().subscribe({
      next: res => {
        this.storageService.clearUser();
        this.router.navigateByUrl('');
      }
    });
  }
}
