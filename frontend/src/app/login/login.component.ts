import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { LoginRequest } from '../model/login-request';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  router = inject(Router);
  loginService = inject(LoginService);
  loginForm: FormGroup;

  constructor(formBuilder: FormBuilder, private storageService: StorageService) {
    // Sprawdzanie czy użytkownik jest zalogowany
    if(storageService.isUserLoggedIn()) {
      if(storageService.isAdmin()) {
        this.router.navigate(['parts']); // Przekierowanie admina do części
      } else {
        this.router.navigate(['client']); // Przekierowanie klienta do panelu klienta
      }
    }
    this.loginForm = formBuilder.group({
      login: [``],
      password: [``]
    });
  }

  testTab = [1,2,3,4,5];

  // Funkcja logowania
  login() {
    let login = this.loginForm.value.login; // Pobranie loginu z formularza
    let password = this.loginForm.value.password; // Pobranie hasła z formularza

    // Wywołanie metody logowania z serwisu LoginService
    this.loginService.login(new LoginRequest(login, password)).subscribe(
      res => {
        this.storageService.safeUser(res);
        this.router.navigate(['parts']); // Przekierowanie na stronę części
      },
      err => {
        console.log(err);
        console.error("GÓWNO")
      }
    );


  }
}
