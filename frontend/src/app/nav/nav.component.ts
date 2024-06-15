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
  showNavBar: boolean = true;

  constructor(
    private loginService: LoginService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavBar = event.url !== "/login" && event.url !== '/';
    });
  }

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
